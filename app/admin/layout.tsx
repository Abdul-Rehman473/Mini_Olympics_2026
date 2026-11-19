'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Skip layout for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    setAccessDenied(false);

    fetch('/api/admin/verify', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          const role = data.role || 'super_admin';
          const effectiveRole = role === 'admin' ? 'super_admin' : role;
          const allowedPages: string[] = Array.isArray(data.permissions) ? data.permissions : [];

          setUserRole(effectiveRole);
          setUsername(data.displayName || data.username || 'Admin');
          setPermissions(allowedPages);

          const hasAccess =
            effectiveRole === 'super_admin' ||
            allowedPages.some((page) => pathname.startsWith(page));

          if (!hasAccess) {
            const defaultPage = data.defaultPage || allowedPages[0] || '/admin/login';
            if (defaultPage && defaultPage !== pathname) {
              router.push(defaultPage);
            }
            setAccessDenied(true);
          } else {
            setAuthenticated(true);
          }
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router, isLoginPage, pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080D1C]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-white/10 rounded-full animate-pulse"></div>
            <div className="w-16 h-16 border-2 border-t-[#12E2C4] rounded-full animate-spin absolute inset-0"></div>
          </div>
          <p className="text-[#94A3B8] font-mono mt-6 text-xs uppercase tracking-widest">AUTHENTICATING TERMINAL...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || accessDenied) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#080D1C] text-[#F8FAFC]">
      <AdminSidebar
        userRole={userRole}
        username={username}
        permissions={permissions}
        onLogout={handleLogout}
      />
      <main className="flex-1 lg:ml-0 min-h-screen overflow-x-hidden bg-[#080D1C]">
        {children}
      </main>
    </div>
  );
}
