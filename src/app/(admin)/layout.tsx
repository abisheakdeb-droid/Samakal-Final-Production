"use client";

import { useAuth, AuthProvider } from '@/contexts/AdminAuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  PenTool,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Zap,
  Globe,
  Image as ImageIcon,
  ShieldAlert,
  Bell
} from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Toaster } from 'sonner';
import { CommandPalette } from '@/components/dashboard/CommandPalette';

// Protected Route Wrapper
import { useLocalStorage } from '@/hooks/use-local-storage';

// Protected Route Wrapper
function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Persist Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage('samakal_sidebar_open', true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, isLoading, router, pathname]);

  if (!mounted || (isLoading && !user)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  if (!user) return null;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Command Center', href: '/admin/dashboard' },
    { icon: PenTool, label: 'Newsroom', href: '/admin/dashboard/articles' },
    { icon: ImageIcon, label: 'Media Lab', href: '/admin/dashboard/media' },
    { icon: BarChart3, label: 'Growth Engine', href: '/admin/dashboard/analytics' },
    // Only Admin can see Team Management
    ...(user.role === 'admin' ? [{ icon: Users, label: 'Team Access', href: '/admin/dashboard/team' }] : []),
    { icon: Bell, label: 'Notifications', href: '/admin/dashboard/notifications' },
    { icon: Settings, label: 'Settings', href: '/admin/dashboard/settings' },
  ];

  // Helper to check active state
  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Toaster position="top-right" />

      {/* Sidebar - Desktop - Z-INDEX BOOST */}
      <aside
        className={clsx(
          "hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 fixed inset-y-0 left-0 z-50 shadow-sm",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
          {isSidebarOpen ? (
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold bg-linear-to-r from-brand-red to-red-600 bg-clip-text text-transparent">Samakal AI</span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase">Studio</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-brand-red">S.</span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-xl transition-all group",
                  active
                    ? "bg-brand-red/10 text-brand-red shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={!isSidebarOpen ? item.label : ''}
              >
                <item.icon size={22} className={clsx("shrink-0", active ? "text-brand-red" : "text-gray-400 group-hover:text-gray-600")} />
                {isSidebarOpen && (
                  <span className="font-medium">
                    {item.label}
                    {/* Visual indicator for active item */}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-red"></span>}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className={clsx("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative ring-2 ring-offset-2 ring-gray-100 flex items-center justify-center">
              {user.image ? (
                <Image src={user.image} alt={user.name} fill className="object-cover" />
              ) : (
                <span className="text-gray-500 font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate">{user.name}</h4>
                <div className="flex items-center gap-1">
                  {user.role === 'admin' && <ShieldAlert size={10} className="text-brand-red" />}
                  <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 w-full px-2 hover:bg-red-50 py-2 rounded transition"
            >
              <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={clsx(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hidden md:block"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 md:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-800 leading-none">
                {menuItems.find(m => isActive(m.href))?.label || 'Dashboard'}
              </h1>
              <span className="text-[10px] text-gray-400 font-medium">Samakal Studio AI v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CommandPalette />
            <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-600 transition">
              <Globe size={14} /> View Site
            </Link>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold shadow-sm animate-pulse">
              <Zap size={14} /> AI Online
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <span className="text-xl font-bold text-brand-red">Samakal AI</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 p-3 rounded-xl transition-all",
                      active
                        ? "bg-brand-red/10 text-brand-red"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon size={22} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative flex items-center justify-center">
                  {user.image ? (
                    <Image src={user.image} alt={user.name} fill className="object-cover" />
                  ) : (
                    <span className="text-gray-500 font-bold text-xs">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{user.name}</h4>
                  <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                </div>
              </div>
              <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-red-500 w-full justify-center py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
