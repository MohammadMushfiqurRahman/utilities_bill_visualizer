import React from 'react';
import { BillData } from '../types';
import SummaryChart from './SummaryChart';
import VendorChart from './VendorChart';
import SummaryCard from './SummaryCard';
import { DocumentSearchIcon, DollarSignIcon, AverageIcon, BoltIcon } from './icons';

interface DashboardProps {
  bills: BillData[];
  allBillsCount: number;
  selectedApartment: string;
  onClearFilters: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bills, allBillsCount, selectedApartment, onClearFilters }) => {
  if (allBillsCount === 0) {
    return (
      <div className="mt-8 rounded-lg bg-white px-6 py-16 text-center shadow-sm dark:bg-slate-800/50">
        <DocumentSearchIcon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
          No Bills Yet
        </h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Upload a utility bill to see your dashboard.
        </p>
      </div>
    );
  }

  if (bills.length === 0 && allBillsCount > 0) {
    return (
      <div className="mt-8 rounded-lg bg-white px-6 py-16 text-center shadow-sm dark:bg-slate-800/50">
        <DocumentSearchIcon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
          No Bills Found
        </h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          There are no bills matching the current filters.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  const totalAmount = bills.reduce((acc, bill) => acc + bill.totalAmount, 0);
  const averageBill = bills.length > 0 ? totalAmount / bills.length : 0;
  const highestBill = Math.max(...bills.map(bill => bill.totalAmount), 0);

  const summaryTitle =
    selectedApartment === 'all'
      ? 'Overall Spending Summary'
      : `Spending Summary for ${selectedApartment}`;

  return (
    <div className="p-4 md:p-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">{summaryTitle}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          title="Total Amount Due"
          value={`$${totalAmount.toFixed(2)}`}
          icon={<DollarSignIcon className="h-8 w-8 text-blue-600" />}
        />
        <SummaryCard
          title="Average Bill"
          value={`$${averageBill.toFixed(2)}`}
          icon={<AverageIcon className="h-8 w-8 text-green-600" />}
        />
        <SummaryCard
          title="Highest Bill"
          value={`$${highestBill.toFixed(2)}`}
          icon={<BoltIcon className="h-8 w-8 text-red-600" />}
        />
      </div>

      <div className="mt-8">
        <SummaryChart bills={bills} />
      </div>

      <div className="mt-8">
        <VendorChart bills={bills} />
      </div>
    </div>
  );
};

export default Dashboard;