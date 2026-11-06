'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookPlus, TrendingUp, Search, Library } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6 text-blue-600">
          <Library className="h-8 w-8" />
        </div>
        <h1 data-testid="home-title" className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          ShelfLife
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
          Keep a list of the books you want to read, are reading or have finished, and easily track your reading progress on your personal digital shelf.
        </p>
        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link href="/books">
              <Button size="lg" className="px-8">
                Go to My Books
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="hover:shadow-md transition-shadow border-slate-200">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-2">
              <BookPlus className="h-6 w-6" />
            </div>
            <CardTitle>Add books</CardTitle>
            <CardDescription>
              Quickly catalog books by title, author, and page count into your personal reading list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Set default statuses to organize your queue and keep track of your growing collection.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-slate-200">
          <CardHeader>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6" />
            </div>
            <CardTitle>Track your progress</CardTitle>
            <CardDescription>
              Advance your books effortlessly from To Read to Reading and Finished with a single click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Real-time summary metrics keep you informed about total pages read and current status counts.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-slate-200">
          <CardHeader>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-2">
              <Search className="h-6 w-6" />
            </div>
            <CardTitle>Search your shelf</CardTitle>
            <CardDescription>
              Filter by reading status and search instantly by title or author to find any book right away.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Combine search and status filters for immediate, responsive results without reloading.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

