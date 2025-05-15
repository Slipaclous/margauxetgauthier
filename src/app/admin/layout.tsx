'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';
import { FaHome, FaImages, FaEnvelope, FaCog, FaPalette } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    setIsAuthenticated(!!auth);
    setIsLoading(false);

    // Si non authentifié et pas sur la page de connexion, rediriger
    if (!auth && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E13B70]"></div>
      </div>
    );
  }

  // Si non authentifié et sur la page de connexion, ne pas afficher le layout
  if (!isAuthenticated && pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 