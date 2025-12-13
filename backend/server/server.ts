import dotenv from 'dotenv';
dotenv.config();

// Now safe to import other modules that use env vars
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import routes, { stripeWebhook } from './serverRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe webhook needs raw body - must be before other middleware
app.post('/api/webhook/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Regular middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(routes);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Log config status
    console.log('📧 Email service:', process.env.RESEND_API_KEY ? 'Configured' : 'Not configured (dev mode)');
    console.log('💳 Stripe:', process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

startServer();
