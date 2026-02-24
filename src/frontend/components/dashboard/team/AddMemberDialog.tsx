"use client";

import { useState } from "react";
import { createUser } from "@/lib/actions-team";
import { toast } from "sonner";
import { X, UserPlus, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function AddMemberDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
        const result = await createUser(formData);
        
        if (result.errors) {
            // Show first error found
            const firstError = Object.values(result.errors)[0];
            toast.error(typeof firstError === 'string' ? firstError : "Validation Error");
        } else if (result.message && !result.message.includes("Success")) {
            toast.error(result.message);
        } else {
            toast.success("Team member added successfully!");
            setIsOpen(false);
            (e.target as HTMLFormElement).reset();
        }
    } catch {
        toast.error("An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-sm font-medium"
      >
        <UserPlus size={18} />
        Add Member
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Content */}
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
                <X size={20} />
            </button>
            
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Team Member</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new account for your editorial team.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        name="name"
                        type="text" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                        name="email"
                        type="email" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                        name="password"
                        type="password" 
                        required
                        minLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
                        placeholder="Min. 6 characters"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select 
                        name="role"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition bg-white"
                    >
                        <option value="editor">Editor (Can write & publish)</option>
                        <option value="admin">Admin (Full access)</option>
                    </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium text-white bg-brand-red rounded-lg transition flex items-center gap-2",
                            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700 shadow-md"
                        )}
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
