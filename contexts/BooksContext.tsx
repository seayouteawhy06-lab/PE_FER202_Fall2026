'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  status: 'To Read' | 'Reading' | 'Finished';
  created_at: string;
}

interface StatusBreakdownItem {
  name: string;
  count: number;
}

interface BooksContextType {
  books: Book[];
  filteredBooks: Book[];
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addBook: (bookData: { title: string; author: string; pages: number; status: string }) => Promise<{ success: boolean; error?: string }>;
  advanceStatus: (book: Book) => Promise<{ success: boolean; error?: string }>;
  deleteBook: (id: string) => Promise<{ success: boolean; error?: string }>;
  loadingBooks: boolean;
  bookCount: number;
  totalPages: number;
  statusBreakdown: StatusBreakdownItem[];
  fetchBooks: () => Promise<void>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingBooks, setLoadingBooks] = useState<boolean>(false);

  const fetchBooks = async () => {
    if (!user) {
      setBooks([]);
      return;
    }
    setLoadingBooks(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching books:', error);
      } else {
        setBooks((data as Book[]) || []);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBooks();
    } else {
      setBooks([]);
      setFilterStatus('');
      setSearchQuery('');
    }
  }, [user?.id]);

  const clearFilters = () => {
    setFilterStatus('');
    setSearchQuery('');
  };

  const addBook = async (bookData: { title: string; author: string; pages: number; status: string }) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error } = await supabase
        .from('books')
        .insert({
          user_id: user.id,
          title: bookData.title.trim(),
          author: bookData.author.trim(),
          pages: Number(bookData.pages),
          status: bookData.status,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        setBooks((prev) => [data as Book, ...prev]);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to add book' };
    }
  };

  const advanceStatus = async (book: Book) => {
    let nextStatus: 'Reading' | 'Finished' | null = null;
    if (book.status === 'To Read') {
      nextStatus = 'Reading';
    } else if (book.status === 'Reading') {
      nextStatus = 'Finished';
    }

    if (!nextStatus) {
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('books')
        .update({ status: nextStatus })
        .eq('id', book.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setBooks((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, status: nextStatus! } : b))
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update book status' };
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase.from('books').delete().eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      setBooks((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete book' };
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesStatus = filterStatus === '' || book.status === filterStatus;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [books, filterStatus, searchQuery]);

  const bookCount = filteredBooks.length;

  const totalPages = useMemo(() => {
    return filteredBooks.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);
  }, [filteredBooks]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of filteredBooks) {
      counts[b.status] = (counts[b.status] || 0) + 1;
    }

    const priority: Record<string, number> = {
      'To Read': 1,
      'Reading': 2,
      'Finished': 3,
    };

    const items = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));

    items.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return (priority[a.name] || 99) - (priority[b.name] || 99);
    });

    return items;
  }, [filteredBooks]);

  return (
    <BooksContext.Provider
      value={{
        books,
        filteredBooks,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        clearFilters,
        addBook,
        advanceStatus,
        deleteBook,
        loadingBooks,
        bookCount,
        totalPages,
        statusBreakdown,
        fetchBooks,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};

