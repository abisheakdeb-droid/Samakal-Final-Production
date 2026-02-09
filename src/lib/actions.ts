'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    
    // Check if it's a redirect error (which is expected for successful login)
    const err = error as { message?: string; digest?: string };
    if (err?.message === 'NEXT_REDIRECT' || err?.digest?.includes('NEXT_REDIRECT')) {
        throw error;
    }

    return 'An unexpected error occurred during login. Please check the server logs.';
  }
}

export async function handleSignOut() {
    await signOut();
}
