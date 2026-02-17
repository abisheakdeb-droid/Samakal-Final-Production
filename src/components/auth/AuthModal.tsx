"use client";

import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { registerUser } from '@/app/actions/auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [view, setView] = useState<'login' | 'signup'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                onClose();
                window.location.reload(); // Refresh to update session
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        try {
            const result = await registerUser(formData);

            if (result.error) {
                if (typeof result.error === 'string') {
                    setError(result.error);
                } else {
                    // Handle Zod errors usually object
                    setError("Invalid input data");
                }
            } else {
                // Success
                onClose();
                window.location.reload();
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: string) => {
        setIsLoading(true);
        try {
            await signIn(provider, { callbackUrl: '/' });
        } catch (error) {
            console.error(`${provider} login failed:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[420px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/20">

                <div className="p-10 pt-12 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-80 h-24">
                            <Image
                                src="/samakal-re-branding.png"
                                alt="Samakal - অসংকোচ প্রকাশের দুরন্ত সাহস"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 font-serif">
                            {view === 'login' ? 'স্বাগতম' : 'অ্যাকাউন্ট তৈরি করুন'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {view === 'login' ? 'সমকাল-এ ফিরে আসার জন্য ধন্যবাদ' : 'সমকাল পরিবারের সদস্য হোন'}
                        </p>
                    </div>

                    <div className="w-full space-y-5">
                        {/* Google Button */}
                        <button
                            onClick={() => handleSocialLogin('google')}
                            disabled={isLoading}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin text-gray-400" size={18} />
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            )}
                            <span className="font-medium">Sign in with Google</span>
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200/50 dark:border-gray-700/50"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-gray-400">
                                <span className="bg-transparent px-2 backdrop-blur-sm">Or continue with email</span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={view === 'login' ? handleCredentialsLogin : handleRegistration} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {view === 'signup' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Full Name"
                                        required
                                        className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/50 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white backdrop-blur-sm"
                                    />
                                </div>
                            )}

                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="demo@samakal.com"
                                    required
                                    className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/50 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white backdrop-blur-sm"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/50 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-white backdrop-blur-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-brand-red text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                    <>
                                        {view === 'login' ? 'Continue' : 'Create Account'}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-2 text-center">
                            <button
                                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                                className="inline-block px-8 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all active:scale-[0.98] text-sm text-gray-600 dark:text-gray-300"
                            >
                                {view === 'login' ? (
                                    <>Don&apos;t have an account? <span className="font-bold text-brand-red ml-1">Sign up</span></>
                                ) : (
                                    <>Already have an account? <span className="font-bold text-brand-red ml-1">Sign in</span></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
