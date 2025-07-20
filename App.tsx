
import React, { useState, useCallback, useMemo } from 'react';
import { BillData } from './types';
import { extractBillDataFromPdf } from './services/geminiService';
import UploadZone from './components/UploadZone';
import Dashboard from './components/Dashboard';
import { Header } from './components/Header';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ApartmentFilter } from './components/ApartmentFilter';

const App: React.FC = () => {
  const [bills, setBills] = useState<BillData[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<string>('all');

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
          const newBillsData = await extractBillDataFromPdf(base64String);
          
          if (!newBillsData || newBillsData.length === 0) {
            throw new Error("No valid bills were found in the provided PDF.");
          }

          const billsWithIds: BillData[] = newBillsData.map((bill: Omit<BillData, 'id'>) => ({
            ...bill,
            id: crypto.randomUUID(),
          }));

          setBills(prevBills => [...prevBills, ...billsWithIds].sort((a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime()));
        } catch (e) {
          console.error(e);
          setError(e instanceof Error ? `Failed to process the PDF: ${e.message}` : 'An unknown error occurred during PDF processing.');
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

  const apartments = useMemo(() => ['all', ...Array.from(new Set(bills.map(b => b.apartment).filter(Boolean)))], [bills]);

  const filteredBills = useMemo(() => {
    if (selectedApartment === 'all') {
      return bills;
    }
    return bills.filter(bill => bill.apartment === selectedApartment);
  }, [bills, selectedApartment]);


  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-700 dark:text-slate-300 mb-2">Upload Your Utility Bill</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
            Drop a PDF with one or more bills and let AI do the rest.
          </p>

          <UploadZone onFileSelect={handleFileProcess} isProcessing={isProcessing} fileName={fileName} />
          
          {error && <ErrorDisplay message={error} />}
          
          <ApartmentFilter 
            apartments={apartments}
            selectedApartment={selectedApartment}
            onSelectApartment={setSelectedApartment}
          />
          
          <Dashboard bills={filteredBills} allBillsCount={bills.length} selectedApartment={selectedApartment} />
        </div>
      </main>
    </div>
  );
};

export default App;
