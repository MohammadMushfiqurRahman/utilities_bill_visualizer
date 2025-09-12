import React from 'react';
import { BillData } from '../types';
import {
  CalendarIcon,
  DollarSignIcon,
  BoltIcon,
  WaterIcon,
  FireIcon,
  DocumentIcon,
  BuildingIcon,
  ListIcon,
} from './icons';

interface BillCardProps {
  bill: BillData;
}

const getVendorIcon = (vendor: string, unit: string) => {
  const lowerVendor = vendor.toLowerCase();
  const lowerUnit = unit.toLowerCase();

  if (lowerUnit.includes('kwh')) return <BoltIcon className="h-5 w-5 text-yellow-500" />;
  if (lowerUnit.includes('gallon') || lowerVendor.includes('water'))
    return <WaterIcon className="h-5 w-5 text-blue-400" />;
  if (lowerUnit.includes('therm') || lowerVendor.includes('gas'))
    return <FireIcon className="h-5 w-5 text-orange-500" />;
  if (
    lowerVendor.includes('garbage') ||
    lowerVendor.includes('recology') ||
    lowerVendor.includes('waste')
  )
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-green-500"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    );

  return <DocumentIcon className="h-5 w-5 text-slate-400" />;
};

const BillCard: React.FC<BillCardProps> = ({ bill }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
              {getVendorIcon(bill.vendorName, bill.usage.unit)}
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {bill.vendorName}
            </h4>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Account</p>
            <p className="font-mono text-sm text-slate-600 dark:text-slate-300">
              {bill.accountNumber}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <BuildingIcon className="h-5 w-5" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{bill.apartment}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
            <DollarSignIcon className="h-5 w-5" />
            <span className="text-sm">Amount Due</span>
          </div>
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            ${bill.totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
            {getVendorIcon(bill.vendorName, bill.usage.unit)}
            <span className="text-sm">Usage</span>
          </div>
          <span className="font-mono text-slate-600 dark:text-slate-300">
            {bill.usage.value.toLocaleString()} {bill.usage.unit}
          </span>
        </div>

        {bill.breakdown && bill.breakdown.length > 0 && (
          <div>
            <div className="mb-2 flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <ListIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Itemized Charges</span>
            </div>
            <div className="ml-2 space-y-1.5 border-l-2 border-slate-200 pl-2 text-sm dark:border-slate-700">
              {bill.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pl-3 text-slate-600 dark:text-slate-300"
                >
                  <span className="pr-2">{item.description}</span>
                  <span className="shrink-0 text-right font-mono">
                    {item.amount < 0
                      ? `-$${Math.abs(item.amount).toFixed(2)}`
                      : `$${item.amount.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm">Bill Date</span>
          </div>
          <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
            {formatDate(bill.billDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-500/80 dark:text-red-400/80">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm font-semibold">Due Date</span>
          </div>
          <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-400">
            {formatDate(bill.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillCard;
