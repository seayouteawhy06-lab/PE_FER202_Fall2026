'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookForm } from '@/components/BookForm';
import { BookFilters } from '@/components/BookFilters';
import { BookSummary } from '@/components/BookSummary';
import { BookList } from '@/components/BookList';

export default function BooksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While app is still finding out whether someone is logged in, show nothing (no flash of content, no wrong redirect)
  if (loading || !user) {
    return null;
  }

  return (
    <div data-testid="books-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Bookshelf</h1>
        <p className="text-slate-500 mt-1">Manage your reading list and track your progress.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* At 1280px (xl breakpoint) the form and summary sit next to the list */}
        <div className="xl:col-span-5 space-y-6">
          <BookForm />
          <BookSummary />
        </div>

        {/* Filters and List */}
        <div className="xl:col-span-7 space-y-6">
          <BookFilters />
          <BookList />
        </div>
      </div>
    </div>
  );
}
