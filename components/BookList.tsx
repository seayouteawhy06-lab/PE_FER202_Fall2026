'use client';

import React from 'react';
import { useBooks, Book } from '@/contexts/BooksContext';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronRight, BookOpen, Clock, CheckCircle } from 'lucide-react';

export const BookList: React.FC = () => {
  const { filteredBooks, advanceStatus, deleteBook } = useBooks();

  const getStatusBadge = (status: Book['status']) => {
    switch (status) {
      case 'To Read':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            <span data-testid="book-status">{status}</span>
          </span>
        );
      case 'Reading':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <BookOpen className="h-3 w-3" />
            <span data-testid="book-status">{status}</span>
          </span>
        );
      case 'Finished':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            <span data-testid="book-status">{status}</span>
          </span>
        );
      default:
        return <span data-testid="book-status">{status}</span>;
    }
  };

  return (
    <div data-testid="book-list" className="space-y-4">
      {filteredBooks.length === 0 ? (
        <div
          data-testid="books-empty"
          className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500 font-medium"
        >
          No books found
        </div>
      ) : (
        filteredBooks.map((book) => (
          <div
            key={book.id}
            data-testid="book-item"
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  data-testid="book-title"
                  className="font-bold text-lg text-slate-900 truncate"
                >
                  {book.title}
                </h3>
                {getStatusBadge(book.status)}
              </div>
              <p
                data-testid="book-author"
                className="text-sm font-medium text-slate-600"
              >
                {book.author}
              </p>
              <p
                data-testid="book-pages"
                className="text-xs text-slate-500 font-semibold"
              >
                {book.pages} pages
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {book.status !== 'Finished' && (
                <Button
                  data-testid="btn-advance-status"
                  size="sm"
                  variant="outline"
                  onClick={() => advanceStatus(book)}
                  className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <span>Advance</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              <Button
                data-testid="btn-delete-book"
                size="sm"
                variant="destructive"
                onClick={() => deleteBook(book.id)}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
