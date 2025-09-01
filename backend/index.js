require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./errorMiddleware');
const billRoutes = require('./routes/billRoutes');
const sequelize = require('./database/database');

const app = express();
const port = process.env.PORT || 8000;

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Enable CORS for our frontend
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Endpoints ---
app.use('/api', billRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// Initialize Database
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
});
