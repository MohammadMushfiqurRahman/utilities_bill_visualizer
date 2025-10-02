import React from 'react';

interface FilterControlsProps {
  sortKey: string;
  setSortKey: (key: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  sortKey,
  setSortKey,
  sortOrder,
  setSortOrder,
  dateRange,
  setDateRange,
}) => {
  return (
    <div className="mt-8 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800/50">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Filters & Sorting</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="sortKey" className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Sort by
          </label>
          <select
            id="sortKey"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 sm:text-sm"
          >
            <option value="billDate">Bill Date</option>
            <option value="totalAmount">Total Amount</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Order
          </label>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="mt-1 flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-600 dark:text-slate-400">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
