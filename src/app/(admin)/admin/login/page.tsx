"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { Loader2, Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
           Sign In <ArrowRight size={18} />
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-900">
      {/* ... Left Column ... */}
      <div className="relative hidden md:flex flex-col justify-end p-12 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070" 
                alt="Newsroom" 
                fill
                className="object-cover opacity-40 mix-blend-overlay"
             />
             <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent" />
        </div>
        
        <div className="relative z-10 space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Samakal Studio AI</h1>
            <p className="text-xl text-gray-300 max-w-md">
                The journalist&apos;s superweapon. Write, optimize, and dominate the news cycle.
            </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                 <div className="h-12 w-12 bg-brand-red rounded-xl mx-auto flex items-center justify-center mb-4">
                    <Lock className="text-white" size={24} />
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h2>
                 <p className="mt-2 text-gray-500">Enter your credentials to access the newsroom.</p>
            </div>

            <form 
                action={dispatch} 
                className="space-y-6 mt-8"
            >
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                    </label>
                    <input 
                        name="email"
                        type="email" 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition dark:bg-gray-900 dark:border-gray-800"
                        placeholder="journalist@samakal.com"
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                    </label>
                    <input 
                        name="password"
                        type="password" 
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition dark:bg-gray-900 dark:border-gray-800"
                        placeholder="••••••••"
                    />
                 </div>
                 
                 {errorMessage && (
                    <div className="text-red-500 text-sm font-medium">
                        {errorMessage}
                    </div>
                 )}

                 <LoginButton />

                 <div className="text-center mt-4">
                    <a href="#" className="text-sm text-gray-500 hover:text-brand-red transition">
                        Forgot password?
                    </a>
                 </div>
            </form>
            
            {/* Demo Creds Hint */}
            <div className="mt-8 p-4 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-900/50">
                <p className="font-semibold mb-2">Demo Access (Password: <code>password</code>)</p>
                <div className="space-y-1">
                    <p><span className="font-medium">Master Admin:</span> Any email (e.g. admin@samakal.com)</p>
                    <p><span className="font-medium">Journalist:</span> Email with &apos;journalist&apos; (e.g. journalist@samakal.com)</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
