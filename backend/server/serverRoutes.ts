// server/serverRoutes.ts

import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getCurrentUser
} from './controllers/auth.controller';
import {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
  checkAvailability,
  getUnavailableDates
} from './controllers/booking.controller';
import {
  createCheckoutSession,
  verifyPayment,
  stripeWebhook,
  getPaymentDetails,
  refundPayment
} from './controllers/payment.controller';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getAllTrailers,
  getRevenueReport,
  makeAdmin
} from './controllers/admin.controller';
import { protect } from './middleware/auth.middleware';
import { isAdmin } from './middleware/admin.middleware';
import { trailers, getTrailerById, getLocations, getTypes } from './data/trailers';

const router = Router();

// ============================================
// ROOT ROUTE
// ============================================
router.get('/', (req, res) => {
  res.json({
    message: 'GW Rentals API is running',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth/*',
      trailers: '/api/trailers',
      bookings: '/api/bookings',
      payments: '/api/payments',
      admin: '/api/admin/*'
    }
  });
});

// ============================================
// AUTH ROUTES
// ============================================
router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.post('/api/auth/verify-email', verifyEmail);
router.post('/api/auth/resend-verification', resendVerification);
router.post('/api/auth/forgot-password', forgotPassword);
router.post('/api/auth/reset-password', resetPassword);
router.post('/api/auth/refresh-token', refreshToken);
router.post('/api/auth/logout', logout);
router.get('/api/auth/me', protect, getCurrentUser);

// ============================================
// TRAILER ROUTES
// ============================================
router.get('/api/trailers', (req, res) => {
  let filtered = [...trailers];
  const { location, type, minPrice, maxPrice, search } = req.query;

  if (location) {
    filtered = filtered.filter(t =>
      t.location.toLowerCase() === (location as string).toLowerCase()
    );
  }

  if (type) {
    filtered = filtered.filter(t =>
      t.type.toLowerCase() === (type as string).toLowerCase()
    );
  }

  if (minPrice) {
    filtered = filtered.filter(t => t.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(t => t.price <= Number(maxPrice));
  }

  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm) ||
      t.type.toLowerCase().includes(searchTerm)
    );
  }

  res.json(filtered);
});

router.get('/api/trailers/:id', (req, res) => {
  const id = Number(req.params.id);
  const trailer = getTrailerById(id);

  if (!trailer) {
    return res.status(404).json({ error: 'Trailer not found' });
  }

  res.json(trailer);
});

router.get('/api/locations', (req, res) => {
  res.json(getLocations());
});

router.get('/api/types', (req, res) => {
  res.json(getTypes());
});

// ============================================
// BOOKING ROUTES
// ============================================
router.post('/api/bookings', protect, createBooking);
router.get('/api/bookings', protect, getUserBookings);
router.get('/api/bookings/:id', protect, getBooking);
router.patch('/api/bookings/:id/cancel', protect, cancelBooking);
router.get('/api/availability', checkAvailability);
router.get('/api/trailers/:trailerId/unavailable-dates', getUnavailableDates);

// ============================================
// PAYMENT ROUTES
// ============================================
router.post('/api/payments/create-checkout-session', protect, createCheckoutSession);
router.post('/api/payments/verify', protect, verifyPayment);
router.get('/api/payments/:paymentIntentId', protect, getPaymentDetails);

// ============================================
// ADMIN ROUTES (Protected + Admin Only)
// ============================================
router.get('/api/admin/dashboard', protect, isAdmin, getDashboardStats);

// User management
router.get('/api/admin/users', protect, isAdmin, getAllUsers);
router.get('/api/admin/users/:id', protect, isAdmin, getUserById);
router.put('/api/admin/users/:id', protect, isAdmin, updateUser);
router.delete('/api/admin/users/:id', protect, isAdmin, deleteUser);

// Booking management
router.get('/api/admin/bookings', protect, isAdmin, getAllBookings);
router.get('/api/admin/bookings/:id', protect, isAdmin, getBookingById);
router.patch('/api/admin/bookings/:id/status', protect, isAdmin, updateBookingStatus);

// Trailer management
router.get('/api/admin/trailers', protect, isAdmin, getAllTrailers);

// Payment management
router.post('/api/admin/payments/refund', protect, isAdmin, refundPayment);

// Reports
router.get('/api/admin/reports/revenue', protect, isAdmin, getRevenueReport);

// Make admin (for initial setup - remove in production)
router.post('/api/admin/make-admin', protect, isAdmin, makeAdmin);

// ============================================
// CONTACT ROUTE
// ============================================
router.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.status(200).json({ success: true, message: 'Message received' });
});

export default router;

// Export webhook handler separately (needs raw body - handled in server.ts)
export { stripeWebhook };
