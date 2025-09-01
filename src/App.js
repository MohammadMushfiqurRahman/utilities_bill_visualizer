import React, { useEffect, useState } from 'react';
import BillTable from './components/BillTable';
import FileUpload from './components/FileUpload';
import { apiClient } from './services/apiClient'; // Import apiClient for GET request

function App() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await apiClient.get('/bills');
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Utilities Bill Visualizer</h1>
      </header>
      <main>
        <FileUpload />
        <h2>Your Bills</h2>
        <BillTable bills={bills} />
      </main>
    </div>
  );
}

export default App;