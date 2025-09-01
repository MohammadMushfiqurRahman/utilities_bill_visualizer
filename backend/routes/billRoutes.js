const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

// Set up multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to handle PDF uploads
router.post('/upload', upload.single('bill'), async (req, res, next) => {
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
    next(error);
  }
});

// Endpoint to get bill data (placeholder)
router.get('/bills', (req, res) => {
  // In a real app, this would fetch data from a database.
  // For now, we'll return a mock array.
  const mockBills = [
    { id: 1, date: '2025-06-15', amount: 105.50, usage: '600 kWh' },
    { id: 2, date: '2025-05-15', amount: 98.75, usage: '550 kWh' },
  ];
  res.status(200).json(mockBills);
});

module.exports = router;
