const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
const port = 8000;

// Enable CORS for our frontend
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- API Endpoints ---

// Endpoint to handle PDF uploads
app.post('/api/upload', upload.single('bill'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // The PDF buffer is in req.file.buffer
    const data = await pdfParse(req.file.buffer);

    // --- PDF Parsing Logic (Placeholder) ---
    // This is where you'll add the logic to extract the data you need.
    // For now, we'll just send back the raw text.
    console.log('Successfully parsed PDF.');

    // In a real app, you would extract specific fields here.
    // For example:
    // const amountDue = data.text.match(/Amount Due: \$(.*)/)[1];
    // const usage = data.text.match(/Usage: (.*) kWh/)[1];

    res.status(200).json({
      message: 'File uploaded and parsed successfully!',
      filename: req.file.originalname,
      text: data.text, // Sending raw text for now
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).send('Error processing PDF file.');
  }
});

// Endpoint to get bill data (placeholder)
app.get('/api/bills', (req, res) => {
  // In a real app, this would fetch data from a database.
  // For now, we'll return a mock array.
  const mockBills = [
    { id: 1, date: '2025-06-15', amount: 105.50, usage: '600 kWh' },
    { id: 2, date: '2025-05-15', amount: 98.75, usage: '550 kWh' },
  ];
  res.status(200).json(mockBills);
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
