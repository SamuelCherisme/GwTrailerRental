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
import { protect } from './middleware/auth.middleware';
import { trailers, getTrailerById, getLocations, getTypes } from './data/trailers';

const router = Router();

// ============================================
// ROOT ROUTE
// ============================================
router.get('/', (req, res) => {
  res.json({
    message: 'GW Rentals API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      trailers: '/api/trailers',
      bookings: '/api/bookings'
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

  // Filter by location
  if (location) {
    filtered = filtered.filter(t =>
      t.location.toLowerCase() === (location as string).toLowerCase()
    );
  }

  // Filter by type
  if (type) {
    filtered = filtered.filter(t =>
      t.type.toLowerCase() === (type as string).toLowerCase()
    );
  }

  // Filter by min price
  if (minPrice) {
    filtered = filtered.filter(t => t.price >= Number(minPrice));
  }

  // Filter by max price
  if (maxPrice) {
    filtered = filtered.filter(t => t.price <= Number(maxPrice));
  }

  // Search by name or description
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

// Get single trailer
router.get('/api/trailers/:id', (req, res) => {
  const id = Number(req.params.id);
  const trailer = getTrailerById(id);

  if (!trailer) {
    return res.status(404).json({ error: 'Trailer not found' });
  }

  res.json(trailer);
});

// Get available locations
router.get('/api/locations', (req, res) => {
  res.json(getLocations());
});

// Get available types
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
// CONTACT ROUTE
// ============================================
router.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.status(200).json({ success: true, message: 'Message received' });
});

// ============================================
// PROTECTED ROUTE EXAMPLE
// ============================================
router.get('/api/protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'You have access to this protected route',
    user: req.user
  });
});

export default router;
