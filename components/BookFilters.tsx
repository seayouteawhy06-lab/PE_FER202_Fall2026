'use client';

import React from 'react';
import { useBooks } from '@/contexts/BooksContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, Search, Filter } from 'lucide-react';

export const BookFilters: React.FC = () => {
  const {
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    clearFilters,
  } = useBooks();

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="sm:col-span-1 lg:col-span-6 space-y-1.5">
          <Label htmlFor="search-input" className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            Search Title or Author
          </Label>
          <Input
            id="search-input"
            type="text"
            data-testid="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-1 lg:col-span-4 space-y-1.5">
          <Label htmlFor="filter-status" className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filter by Status
          </Label>
          <select
            id="filter-status"
            data-testid="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-slate-800"
          >
            <option value="">All</option>
            <option value="To Read">To Read</option>
            <option value="Reading">Reading</option>
            <option value="Finished">Finished</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Button
            type="button"
            variant="outline"
            data-testid="btn-clear-filters"
            onClick={clearFilters}
            className="w-full flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

