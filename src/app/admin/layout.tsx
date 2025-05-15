'use client';

import { usePathname } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation currentPath={pathname} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 