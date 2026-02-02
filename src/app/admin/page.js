'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if authenticated
    const auth = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');
    const isExpired = authTime && (Date.now() - parseInt(authTime)) > 24 * 60 * 60 * 1000;

    if (auth === 'true' && !isExpired) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
