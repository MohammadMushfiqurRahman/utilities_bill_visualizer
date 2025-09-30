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
    <div className="rounded-xl bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
            {getVendorIcon(bill.vendorName, bill.usage.unit)}
          </div>
          <div>
            <h4 className="text-md font-bold text-slate-800 dark:text-slate-200">
              {bill.vendorName}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{bill.apartment}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            ${bill.totalAmount.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(bill.billDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default BillCard;