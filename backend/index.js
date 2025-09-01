require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./errorMiddleware');
const billRoutes = require('./routes/billRoutes');

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS for our frontend
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Endpoints ---
app.use('/api', billRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
