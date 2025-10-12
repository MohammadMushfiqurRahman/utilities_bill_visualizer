const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Op } = require('sequelize');
const { parsePdf } = require('../services/pdfService');
const { extractBillDataFromPdfWithGemini } = require('../services/geminiPdfService');
const Bill = require('../models/bill');

// Set up multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to handle PDF uploads
router.post('/upload', upload.single('bill'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const { amountDue, dueDate, usage } = await parsePdf(req.file.buffer);

    if (amountDue === null || dueDate === null || usage === null) {
      return res.status(400).send('Could not extract all required fields from the PDF.');
    }

    const bill = await Bill.create({ totalAmount: amountDue, dueDate, usageValue: usage });

    res.status(201).json({
      message: 'File uploaded, parsed, and saved successfully!',
      bill,
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint to get all bills
router.get('/bills', async (req, res, next) => {
  try {
    const { sortBy, order, startDate, endDate, apartment } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.billDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }
    if (apartment && apartment !== 'all') {
      where.apartment = apartment;
    }

    const orderClause = [];
    if (sortBy && order) {
      orderClause.push([sortBy, order]);
    }

    const bills = await Bill.findAll({ where, order: orderClause });
    res.status(200).json(bills);
  } catch (error) {
    next(error);
  }
});

// Endpoint to get a single bill by ID
router.get('/bills/:id', async (req, res, next) => {
  try {
    const bill = await Bill.findByPk(req.params.id);

    if (bill) {
      res.status(200).json(bill);
    } else {
      res.status(404).send('Bill not found');
    }
  } catch (error) {
    next(error);
  }
});

// New endpoint for Gemini processing
router.post('/process-gemini', async (req, res, next) => {
  try {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
      return res.status(400).send('No PDF data provided.');
    }
    const extractedBills = await extractBillDataFromPdfWithGemini(pdfBase64);
    res.status(200).json(extractedBills);
  } catch (error) {
    next(error);
  }
});

// Endpoint for bulk bill creation
router.post('/bills/bulk', async (req, res, next) => {
  try {
    const { bills } = req.body;
    if (!bills || !Array.isArray(bills)) {
      return res.status(400).send("Invalid request body. Expected a 'bills' array.");
    }

    const savedBills = await Promise.all(
      bills.map((bill) =>
        Bill.create({
          vendorName: bill.vendorName,
          billDate: bill.billDate,
          dueDate: bill.dueDate,
          totalAmount: bill.totalAmount,
          usageValue: bill.usage?.value,
          usageUnit: bill.usage?.unit,
          accountNumber: bill.accountNumber,
          apartment: bill.apartment,
          breakdown: bill.breakdown,
        })
      )
    );

    res.status(201).json(savedBills);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
