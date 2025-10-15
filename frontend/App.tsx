import React, { useState, useCallback, useEffect } from 'react';
import { BillData } from './types';
import Dashboard from './components/Dashboard';
import { ApartmentFilter } from './components/ApartmentFilter';
import FilterControls from './components/FilterControls';
import BillCard from './components/BillCard';
import ReviewBillsModal from './components/ReviewBillsModal';
import UploadModal from './components/UploadModal';
import { UploadIcon } from './components/icons';

const App: React.FC = () => {
  const [bills, setBills] = useState<BillData[]>([]);
  const [previousBills, setPreviousBills] = useState<BillData[]>([]);
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const fetchBills = useCallback(async () => {
    setIsLoading(true);
    try {
      const { start, end } = dateRange;
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;

      let previousStartDate: Date | null = null;
      let previousEndDate: Date | null = null;

      if (startDate && endDate) {
        const diff = endDate.getTime() - startDate.getTime();
        previousEndDate = new Date(startDate.getTime() - 1);
        previousStartDate = new Date(previousEndDate.getTime() - diff);
      }

      const fetchPromises = [];

      // Current period promise
      const currentParams = new URLSearchParams({
        sortBy: sortKey,
        order: sortOrder,
        apartment: selectedApartment,
        ...(start && { startDate: start }),
        ...(end && { endDate: end }),
      });
      fetchPromises.push(fetch(`/api/bills?${currentParams.toString()}`).then((res) => res.json()));

      // Previous period promise
      if (previousStartDate && previousEndDate) {
        const previousParams = new URLSearchParams({
          sortBy: sortKey,
          order: sortOrder,
          apartment: selectedApartment,
          startDate: previousStartDate.toISOString().split('T')[0],
          endDate: previousEndDate.toISOString().split('T')[0],
        });
        fetchPromises.push(fetch(`/api/bills?${previousParams.toString()}`).then((res) => res.json()));
      } else {
        fetchPromises.push(Promise.resolve([])); // Resolve with empty array if no previous period
      }

      const [currentData, previousData] = await Promise.all(fetchPromises);

      setBills(currentData);
      setPreviousBills(previousData);

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
          setIsUploadModalOpen(false); // Close modal on success
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
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileSelect={handleFileProcess}
        isProcessing={isProcessing}
        fileName={fileName}
        error={error}
      />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 md:border-r md:border-slate-200 dark:md:border-slate-700">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Uploaded Bills</h3>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <UploadIcon className="h-5 w-5" />
                <span>Upload New Bill</span>
              </button>
            </div>
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
        <div className="w-full md:w-2/3">
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center gap-4">
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
            </div>
            <Dashboard
              bills={bills}
              previousBills={previousBills}
              allBillsCount={bills.length} // This might need adjustment depending on desired total
              selectedApartment={selectedApartment}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
