'use client';

import { usePathname } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 