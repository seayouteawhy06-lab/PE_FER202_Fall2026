'use client';

import React, { useState } from 'react';
import { useBooks } from '@/contexts/BooksContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export const BookForm: React.FC = () => {
  const { addBook } = useBooks();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [status, setStatus] = useState('');

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [supabaseError, setSupabaseError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateTitle = (val: string) => {
    if (!val || val.trim() === '') {
      return 'Title is required';
    }
    if (val.length > 80) {
      return 'Title must be at most 80 characters';
    }
    return '';
  };

  const validateAuthor = (val: string) => {
    if (!val || val.trim() === '') {
      return 'Author is required';
    }
    if (val.length > 60) {
      return 'Author must be at most 60 characters';
    }
    return '';
  };

  const validatePages = (val: string) => {
    if (!val || val.trim() === '') {
      return 'Pages is required';
    }
    const trimmed = val.trim();
    if (!/^\d+$/.test(trimmed)) {
      return 'Pages must be a whole number between 1 and 5000';
    }
    const num = Number(trimmed);
    if (num < 1 || num > 5000) {
      return 'Pages must be a whole number between 1 and 5000';
    }
    return '';
  };

  const validateStatus = (val: string) => {
    if (!val || val.trim() === '') {
      return 'Please choose a status';
    }
    return '';
  };

  const titleError = hasSubmitted ? validateTitle(title) : '';
  const authorError = hasSubmitted ? validateAuthor(author) : '';
  const pagesError = hasSubmitted ? validatePages(pages) : '';
  const statusError = hasSubmitted ? validateStatus(status) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setSupabaseError('');
    setSuccessMessage('');

    const tErr = validateTitle(title);
    const aErr = validateAuthor(author);
    const pErr = validatePages(pages);
    const sErr = validateStatus(status);

    if (tErr || aErr || pErr || sErr) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addBook({
        title,
        author,
        pages: Number(pages.trim()),
        status,
      });

      if (!result.success) {
        setSupabaseError(result.error || 'Failed to add book');
      } else {
        setSuccessMessage('Book added');
        setTitle('');
        setAuthor('');
        setPages('');
        setStatus('');
        setHasSubmitted(false);
      }
    } catch (err: any) {
      setSupabaseError(err?.message || 'Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <PlusCircle className="h-5 w-5 text-blue-600" />
          Add a Book
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form data-testid="book-form" noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="input-title">Title</Label>
            <Input
              id="input-title"
              data-testid="input-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (supabaseError) setSupabaseError('');
                if (successMessage) setSuccessMessage('');
              }}
              placeholder="e.g. The Great Gatsby"
            />
            {titleError && (
              <p data-testid="error-title" className="text-sm text-red-500 font-medium">
                {titleError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-author">Author</Label>
            <Input
              id="input-author"
              data-testid="input-author"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                if (supabaseError) setSupabaseError('');
                if (successMessage) setSuccessMessage('');
              }}
              placeholder="e.g. F. Scott Fitzgerald"
            />
            {authorError && (
              <p data-testid="error-author" className="text-sm text-red-500 font-medium">
                {authorError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-pages">Number of Pages</Label>
            <Input
              id="input-pages"
              type="text"
              data-testid="input-pages"
              value={pages}
              onChange={(e) => {
                setPages(e.target.value);
                if (supabaseError) setSupabaseError('');
                if (successMessage) setSuccessMessage('');
              }}
              placeholder="e.g. 180"
            />
            {pagesError && (
              <p data-testid="error-pages" className="text-sm text-red-500 font-medium">
                {pagesError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="select-status">Status</Label>
            <select
              id="select-status"
              data-testid="select-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                if (supabaseError) setSupabaseError('');
                if (successMessage) setSuccessMessage('');
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-slate-800"
            >
              <option value="">Choose status</option>
              <option value="To Read">To Read</option>
              <option value="Reading">Reading</option>
              <option value="Finished">Finished</option>
            </select>
            {statusError && (
              <p data-testid="error-status" className="text-sm text-red-500 font-medium">
                {statusError}
              </p>
            )}
          </div>

          {supabaseError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p data-testid="error-book" className="text-sm text-red-600 font-medium">
                {supabaseError}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p data-testid="book-success" className="text-sm text-green-700 font-medium">
                {successMessage}
              </p>
            </div>
          )}

          <Button
            type="submit"
            data-testid="btn-add-book"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
