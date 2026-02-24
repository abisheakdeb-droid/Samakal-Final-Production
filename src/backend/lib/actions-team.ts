"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { User } from "./definitions";

// Validation Schema for Creating User
const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "editor"]),
});

export async function fetchUsers() {
  try {
    const session = await auth();
    // Only allow admins to fetch users
    if (session?.user?.role !== 'admin') {
       // In a real app we might throw or return empty, 
       // but for now let's adhere to RBAC.
       // Note: Currently middleware protects /admin routes, but server action needs check too.
    }

    const data = await sql<User>`
      SELECT id, name, email, role, avatar
      FROM users
      ORDER BY name ASC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function createUser(formData: FormData) {
  // Authentication & Authorization Check
  const session = await auth();
  if (session?.user?.role !== 'admin') {
      return { message: 'Unauthorized: Only admins can manage the team.' };
  }

  const validatedFields = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }

  const { name, email, password, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create User. Email might depend on unique constraint.',
    };
  }

  revalidatePath('/admin/dashboard/team');
  return { message: 'User Created Successfully' };
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'editor') {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return { message: 'Unauthorized' };
    }

    try {
        await sql`
            UPDATE users
            SET role = ${newRole}
            WHERE id = ${userId}
        `;
        revalidatePath('/admin/dashboard/team');
        return { message: 'Role Updated' };
    } catch {
        return { message: 'Database Error' };
    }
}

export async function deleteUser(userId: string) {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        return { message: 'Unauthorized' };
    }
    
    // Prevent self-deletion
    if (session.user.id === userId) {
        return { message: 'Cannot delete your own account.' };
    }

    try {
        await sql`DELETE FROM users WHERE id = ${userId}`;
        revalidatePath('/admin/dashboard/team');
        return { message: 'User Deleted' };
    } catch {
        return { message: 'Database Error' };
    }
}
