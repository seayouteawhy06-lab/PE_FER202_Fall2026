import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { BooksProvider } from '@/contexts/BooksContext';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'ShelfLife - Track Your Personal Library',
  description: 'Keep a list of the books you want to read, are reading or have finished.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
        <AuthProvider>
          <BooksProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </BooksProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
