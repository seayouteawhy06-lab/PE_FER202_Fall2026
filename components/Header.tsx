'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl text-slate-900 tracking-tight">ShelfLife</span>
        </Link>

        <div className="flex items-center space-x-4">
          {!loading && (
            user ? (
              <div className="flex items-center space-x-4">
                <span data-testid="user-email" className="text-sm font-medium text-slate-700">
                  {user.email}
                </span>
                <Link
                  href="/books"
                  data-testid="link-books"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Books
                </Link>
                <Button
                  data-testid="btn-logout"
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" data-testid="btn-login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register" data-testid="btn-register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

