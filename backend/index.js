require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./errorMiddleware');
const authMiddleware = require('./authMiddleware');
const billRoutes = require('./routes/billRoutes');
const authRoutes = require('./routes/authRoutes');
const geminiRoutes = require('./routes/geminiRoutes');
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- API Endpoints ---
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, geminiRoutes);
app.use('/api', authMiddleware, billRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// Initialize Database
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
});
