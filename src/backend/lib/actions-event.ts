"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";

const EventSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  banner_image: z.string().optional(),
  is_active: z.boolean().optional(),
});

const CreateEvent = EventSchema.omit({ id: true });

export async function fetchEvents() {
  try {
    const data = await sql`
      SELECT * FROM events
      ORDER BY created_at DESC
    `;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchActiveEvent() {
    try {
      const data = await sql`
        SELECT * FROM events
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT 1
      `;
      return data.rows[0];
    } catch (error) {
      console.error('Database Error:', error);
      return null;
    }
}

export async function fetchEventBySlug(slug: string) {
    try {
      const data = await sql`
        SELECT * FROM events
        WHERE slug = ${slug}
      `;
      return data.rows[0];
    } catch (error) {
      console.error('Database Error:', error);
      return null;
    }
}

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { message: 'Unauthorized' };
  }

  const validatedFields = CreateEvent.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    banner_image: formData.get('banner_image'),
    is_active: formData.get('is_active') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Event.',
    };
  }

  const { title, slug, description, banner_image, is_active } = validatedFields.data;

  try {
    // If setting active, deactivate others (optional business rule: only one active event at a time)
    if (is_active) {
        await sql`UPDATE events SET is_active = false`;
    }

    await sql`
      INSERT INTO events (title, slug, description, banner_image, is_active)
      VALUES (${title}, ${slug}, ${description || ''}, ${banner_image || ''}, ${is_active || false})
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Create Event.' };
  }

  revalidatePath('/admin/dashboard/events');
  redirect('/admin/dashboard/events');
}

export async function updateEvent(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        return { message: 'Unauthorized' };
    }

    const validatedFields = CreateEvent.safeParse({
        title: formData.get('title'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        banner_image: formData.get('banner_image'),
        is_active: formData.get('is_active') === 'on',
    });

    if (!validatedFields.success) {
        return { message: 'Validation Failed' };
    }

    const { title, slug, description, banner_image, is_active } = validatedFields.data;

    try {
        if (is_active) {
            await sql`UPDATE events SET is_active = false WHERE id != ${id}`;
        }

        await sql`
            UPDATE events
            SET title = ${title}, slug = ${slug}, description = ${description || ''}, 
                banner_image = ${banner_image || ''}, is_active = ${is_active || false}
            WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Event.' };
    }

    revalidatePath('/admin/dashboard/events');
    redirect('/admin/dashboard/events');
}

export async function deleteEvent(id: string) {
    try {
        await sql`DELETE FROM events WHERE id = ${id}`;
        revalidatePath('/admin/dashboard/events');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Event.' };
    }
}
