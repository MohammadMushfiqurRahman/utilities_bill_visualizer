import React, { useState, useCallback, useMemo } from 'react';
import { BillData } from './types';
import UploadZone from './components/UploadZone';
import Dashboard from './components/Dashboard';
import { Header } from './components/Header';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ApartmentFilter } from './components/ApartmentFilter';
import FilterControls from './components/FilterControls';
import BillCard from './components/BillCard';
import ReviewBillsModal from './components/ReviewBillsModal';

const App: React.FC = () => {
  const [bills, setBills] = useState<BillData[]>([]);
  const [pendingBills, setPendingBills] = useState<BillData[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<string>('all');
  const [sortKey, setSortKey] = useState<string>('billDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  const handleFileProcess = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64String = (reader.result as string).split(',')[1];

          const response = await fetch('/api/process-gemini', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfBase64: base64String }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process PDF.');
          }

          const newBillsData = await response.json();

          if (!newBillsData || newBillsData.length === 0) {
            throw new Error('No valid bills were found in the provided PDF.');
          }

          const billsWithIds: BillData[] = newBillsData.map((bill: Omit<BillData, 'id'>) => ({
            ...bill,
            id: crypto.randomUUID(),
          }));

          setPendingBills(billsWithIds);
        } catch (e) {
          console.error(e);
          setError(
            e instanceof Error
              ? `Failed to process the PDF: ${e.message}`
              : 'An unknown error occurred during PDF processing.'
          );
        } finally {
          setIsProcessing(false);
          setFileName(null);
        }
      };
      reader.onerror = () => {
        setIsProcessing(false);
        setFileName(null);
        setError('Failed to read the file.');
      };
    } catch (e) {
      setIsProcessing(false);
      setFileName(null);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    }
  }, []);

  const handleApproveBills = (approvedBills: BillData[]) => {
    setBills((prevBills) => [...prevBills, ...approvedBills]);
    setPendingBills([]);
  };

  const handleDiscardBills = () => {
    setPendingBills([]);
  };

  const apartments = useMemo(
    () => ['all', ...Array.from(new Set(bills.map((b) => b.apartment).filter(Boolean)))],
    [bills]
  );

  const filteredBills = useMemo(() => {
    let filtered = bills;

    if (selectedApartment !== 'all') {
      filtered = filtered.filter((bill) => bill.apartment === selectedApartment);
    }

    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start).getTime();
      const endDate = new Date(dateRange.end).getTime();
      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.billDate).getTime();
        return billDate >= startDate && billDate <= endDate;
      });
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortKey as keyof BillData];
      const bValue = b[sortKey as keyof BillData];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Fallback for dates
      const aDate = new Date(a.billDate).getTime();
      const bDate = new Date(b.billDate).getTime();
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    });
  }, [bills, selectedApartment, sortKey, sortOrder, dateRange]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {pendingBills.length > 0 && (
        <ReviewBillsModal
          bills={pendingBills}
          onApprove={handleApproveBills}
          onDiscard={handleDiscardBills}
        />
      )}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 md:border-r md:border-slate-200 dark:md:border-slate-700">
          <Header />
          <div className="p-4">
            <h2 className="mb-2 text-center text-2xl font-bold text-slate-700 md:text-3xl dark:text-slate-300">
              Upload Your Utility Bill
            </h2>
            <p className="mb-8 text-center text-slate-500 dark:text-slate-400">
              Drop a PDF with one or more bills and let AI do the rest.
            </p>
            <UploadZone
              onFileSelect={handleFileProcess}
              isProcessing={isProcessing}
              fileName={fileName}
            />
            {error && <ErrorDisplay message={error} />}
            <ApartmentFilter
              apartments={apartments}
              selectedApartment={selectedApartment}
              onSelectApartment={setSelectedApartment}
            />
            <FilterControls
              sortKey={sortKey}
              setSortKey={setSortKey}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Uploaded Bills</h3>
              <div className="mt-4 space-y-4">
                {filteredBills.map((bill) => (
                  <BillCard key={bill.id} bill={bill} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <Dashboard
            bills={filteredBills}
            allBillsCount={bills.length}
            selectedApartment={selectedApartment}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
