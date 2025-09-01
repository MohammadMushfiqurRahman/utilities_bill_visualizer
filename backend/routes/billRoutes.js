const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parsePdf } = require('../services/pdfService');

// Set up multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to handle PDF uploads
router.post('/upload', upload.single('bill'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const parsedData = await parsePdf(req.file.buffer);

    res.status(200).json({
      message: 'File uploaded and parsed successfully!',
      filename: req.file.originalname,
      data: parsedData,
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
