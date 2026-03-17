const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Zamani Backend API is running...' });
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/treasury', require('./routes/treasuryRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/savings', require('./routes/savings'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Object:', err);
    res.status(500).json({ error: err.message || err.toString() });
});

module.exports = app;
