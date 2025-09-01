import React, { useState } from 'react';
import { uploadBill } from '../services/apiClient';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    try {
      const response = await uploadBill(selectedFile);
      setMessage(`Upload successful: ${response.data.message}`);
      setSelectedFile(null); // Clear selected file after successful upload
    } catch (error) {
      setMessage(`Upload failed: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload Utility Bill (PDF)</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUpload;