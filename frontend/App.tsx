import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  const [allApartments, setAllApartments] = useState<string[]>([]);
  const [pendingBills, setPendingBills] = useState<BillData[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<string>('all');
  const [sortKey, setSortKey] = useState<string>('billDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  const fetchBills = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy: sortKey,
        order: sortOrder,
        apartment: selectedApartment,
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      });
      const response = await fetch(`/api/bills?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bills.');
      }
      const data = await response.json();
      setBills(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sortKey, sortOrder, selectedApartment, dateRange]);

  const fetchAllApartments = useCallback(async () => {
    try {
      const response = await fetch('/api/bills'); // Fetch all bills without filters
      if (!response.ok) {
        throw new Error('Failed to fetch apartments.');
      }
      const allBills = await response.json();
      const uniqueApartments = ['all', ...Array.from(new Set(allBills.map((b: BillData) => b.apartment).filter(Boolean)))];
      setAllApartments(uniqueApartments);
    } catch (e) {
      console.error('Failed to fetch apartments:', e);
    }
  }, []);

  useEffect(() => {
    fetchBills();
    fetchAllApartments();
  }, []); // Initial fetch

  useEffect(() => {
    fetchBills();
  }, [fetchBills]); // Refetch when filters/sorting change

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
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ pdfBase64: base64String }),
          });

          if (!response.ok) {
            let errorMessage = 'Failed to process PDF.';
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // The response was not JSON, use the status text as a fallback
              errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const newBillsData = await response.json();

          if (!newBillsData || newBillsData.length === 0) {
            throw new Error('No valid bills were found in the provided PDF.');
          }

          const billsWithIds: BillData[] = newBillsData.map((bill: Omit<BillData, 'id'>) => ({
            ...bill,
            id: crypto.randomUUID(), // Keep temporary ID for the review modal key
          }));

          setPendingBills(billsWithIds);
        } catch (e) {
          const errorMessage = e instanceof Error ? `Failed to process PDF: ${e.message}` : 'An unknown error occurred.';
          setError(errorMessage);
          console.error("Processing Error:", e); // Log the full error
        } finally {
          setIsProcessing(false);
          setFileName(null);
        }
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      console.error("File Handling Error:", e); // Log the full error
      setIsProcessing(false);
      setFileName(null);
    }
  }, []);

  const handleApproveBills = async (approvedBills: BillData[]) => {
    try {
      const response = await fetch('/api/bills/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bills: approvedBills }),
      });

      if (!response.ok) {
        throw new Error('Failed to save approved bills.');
      }

      setPendingBills([]);
      await fetchBills(); // Refresh the bill list
      await fetchAllApartments(); // Refresh apartment list
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    }
  };

  const handleDiscardBills = () => {
    setPendingBills([]);
  };

  const handleClearFilters = () => {
    setSelectedApartment('all');
    setSortKey('billDate');
    setSortOrder('desc');
    setDateRange({ start: '', end: '' });
  };

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
              apartments={allApartments}
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
              {isLoading ? (
                <p className="text-center text-slate-500 dark:text-slate-400">Loading bills...</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {bills.map((bill) => (
                    <BillCard key={bill.id} bill={bill} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <Dashboard
            bills={bills}
            allBillsCount={bills.length} // This might need adjustment depending on desired total
            selectedApartment={selectedApartment}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
