'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signIn, auth } from '@/auth';

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password } = validatedFields.data;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "User with this email already exists." };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user', // Default role
            },
        });

        // Attempt to sign in immediately after registration
        try {
            await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            return { success: true };
        } catch (signInError) {
            // If auto-login fails, return success anyway so user can login manually
            console.error("Auto-login failed:", signInError);
            return { success: true, warning: "Account created. Please log in." };
        }

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function updateUserAvatar(avatarUrl: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return { error: "Not authenticated" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: avatarUrl },
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating avatar:", error);
        return { error: "Failed to update avatar" };
    }
}
