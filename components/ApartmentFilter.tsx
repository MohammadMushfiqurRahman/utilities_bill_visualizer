import React from 'react';

interface ApartmentFilterProps {
  apartments: string[];
  selectedApartment: string;
  onSelectApartment: (apartment: string) => void;
}

export const ApartmentFilter: React.FC<ApartmentFilterProps> = ({ apartments, selectedApartment, onSelectApartment }) => {
  // The `apartments` array contains 'all' plus any unique apartment names found.
  // We only show the filter if at least one apartment has been identified from the bills.
  // This means the array length will be > 1 (e.g., ['all', 'Apt 101']).
  if (apartments.length <= 1) {
    return null;
  }
  
  return (
    <div className="my-8 flex items-center justify-center space-x-3">
        <label htmlFor="apartment-filter" className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Showing bills for:
        </label>
        <select
            id="apartment-filter"
            value={selectedApartment}
            onChange={(e) => onSelectApartment(e.target.value)}
            className="block w-auto pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200"
        >
            <option value="all">All Apartments</option>
            {apartments.filter(apt => apt !== 'all').map(apt => (
                <option key={apt} value={apt}>
                    {apt || "Unassigned"}
                </option>
            ))}
        </select>
    </div>
  );
};
