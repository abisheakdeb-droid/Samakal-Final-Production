"use client";

import { User } from "@/lib/definitions";
import { Trash2, Shield, ShieldAlert, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUser, updateUserRole } from "@/lib/actions-team";

export default function TeamTable({ users }: { users: User[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    if (!confirm("Are you sure you want to change this user's role?")) return;
    
    setLoadingId(userId);
    const newRole = currentRole === 'admin' ? 'editor' : 'admin';
    
    try {
        const res = await updateUserRole(userId, newRole);
        if (res.message.includes("Updated")) {
            toast.success("Role updated successfully");
        } else {
            toast.error(res.message);
        }
    } catch {
        toast.error("Failed to update role");
    } finally {
        setLoadingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;
    
    setLoadingId(userId);
    try {
        const res = await deleteUser(userId);
        if (res.message.includes("Deleted")) {
            toast.success("User deleted successfully");
        } else {
            toast.error(res.message);
        }
    } catch {
        toast.error("Failed to delete user");
    } finally {
        setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 relative">
                    {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} sizes="100vw" fill className="object-cover" />
                    ) : (
                        <UserIcon className="text-gray-400" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    user.role === 'admin' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                    {user.role === 'admin' ? <ShieldAlert size={12} /> : <Shield size={12} />}
                    {user.role.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button 
                        onClick={() => handleRoleUpdate(user.id, user.role)}
                        disabled={loadingId === user.id}
                        className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition"
                        title="Toggle Role"
                    >
                        <Shield size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={loadingId === user.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete User"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
              <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      No team members found.
                  </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
