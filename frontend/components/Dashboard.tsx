import React from 'react';
import { BillData } from '../types';
import BillCard from './BillCard';
import SummaryChart from './SummaryChart';
import { DocumentSearchIcon } from './icons';

interface DashboardProps {
  bills: BillData[];
  allBillsCount: number;
  selectedApartment: string;
}

const Dashboard: React.FC<DashboardProps> = ({ bills, allBillsCount, selectedApartment }) => {
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

  const summaryTitle =
    selectedApartment === 'all'
      ? 'Overall Spending Summary'
      : `Spending Summary for ${selectedApartment}`;

  const allBillsTitle =
    selectedApartment === 'all' ? 'All Bills' : `Bills for ${selectedApartment}`;

  if (bills.length === 0 && allBillsCount > 0) {
    return (
      <div className="mt-8 rounded-lg bg-white px-6 py-16 text-center shadow-sm dark:bg-slate-800/50">
        <DocumentSearchIcon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
        <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
          No Bills Found
        </h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          There are no bills matching the filter "{selectedApartment}".
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h3 className="mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">{summaryTitle}</h3>
      <div className="rounded-xl bg-white p-4 shadow-md sm:p-6 dark:bg-slate-800">
        <SummaryChart bills={bills} />
      </div>

      <h3 className="mt-12 mb-6 text-2xl font-bold text-slate-700 dark:text-slate-300">
        {allBillsTitle}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bills.map((bill) => (
          <BillCard key={bill.id} bill={bill} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
