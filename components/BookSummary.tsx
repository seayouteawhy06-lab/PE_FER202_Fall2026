'use client';

import React from 'react';
import { useBooks } from '@/contexts/BooksContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, BookOpen, Layers } from 'lucide-react';

export const BookSummary: React.FC = () => {
  const { bookCount, totalPages, statusBreakdown } = useBooks();

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Reading Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex flex-col">
            <span className="text-xs font-medium text-blue-600 flex items-center gap-1 mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              Books
            </span>
            <span data-testid="book-count" className="text-2xl font-bold text-blue-900">
              {bookCount}
            </span>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex flex-col">
            <span className="text-xs font-medium text-purple-600 flex items-center gap-1 mb-1">
              <Layers className="h-3.5 w-3.5" />
              Pages
            </span>
            <span data-testid="total-pages" className="text-2xl font-bold text-purple-900">
              {totalPages}
            </span>
          </div>
        </div>

        {/* Status Breakdown */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Status Breakdown
          </h4>
          <div data-testid="status-breakdown" className="space-y-2">
            {statusBreakdown.map((item) => (
              <div
                key={item.name}
                data-testid="breakdown-row"
                className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg text-sm border border-slate-100"
              >
                <span data-testid="breakdown-name" className="font-medium text-slate-700">
                  {item.name}
                </span>
                <span data-testid="breakdown-count" className="font-bold text-slate-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
