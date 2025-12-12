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
const trailers = [
  {
    id: 1,
    name: 'Utility Trailer',
    title: 'Utility Trailer',
    location: 'Atlanta',
    type: 'Utility',
    price: 200,
    dailyRate: 200,
    description: 'Lightweight utility trailer perfect for everyday hauling. Great for moving furniture, yard waste, or small equipment.',
    tagline: 'Perfect for everyday hauling',
    size: '5x8 ft',
    capacity: 2000,
    axles: 1,
    minRentalDays: 1,
    features: ['Ramp gate', 'Tie-down points', 'LED lights'],
    imageUrl: '/assets/trailers/utility.jpg'
  },
  {
    id: 2,
    name: 'Flatbed Trailer',
    title: 'Flatbed Trailer',
    location: 'Dallas',
    type: 'Flatbed',
    price: 300,
    dailyRate: 300,
    description: 'Heavy-duty flatbed trailer built for serious loads. Ideal for vehicles, machinery, and construction materials.',
    tagline: 'Built for heavy-duty jobs',
    size: '8x16 ft',
    capacity: 7000,
    axles: 2,
    minRentalDays: 1,
    features: ['Steel deck', 'Stake pockets', 'Tie-down rings', 'Adjustable ramps'],
    imageUrl: '/assets/trailers/flatbed.jpg'
  },
  {
    id: 3,
    name: 'Enclosed Trailer',
    title: 'Enclosed Trailer',
    location: 'Atlanta',
    type: 'Enclosed',
    price: 400,
    dailyRate: 400,
    description: 'Secure enclosed trailer for weather protection and security. Perfect for valuable cargo, tools, or long-distance moves.',
    tagline: 'Maximum protection for your cargo',
    size: '7x14 ft',
    capacity: 5000,
    axles: 2,
    minRentalDays: 1,
    features: ['Lockable doors', 'Interior lighting', 'E-track system', 'Side door'],
    imageUrl: '/assets/trailers/enclosed.jpg'
  },
  {
    id: 4,
    name: 'Compact Utility Trailer',
    title: 'Compact Utility Trailer',
    location: 'Miami',
    type: 'Utility',
    price: 150,
    dailyRate: 150,
    description: 'Compact utility trailer for light loads. Easy to tow with any vehicle, perfect for small projects.',
    tagline: 'Small but mighty',
    size: '4x6 ft',
    capacity: 1000,
    axles: 1,
    minRentalDays: 1,
    features: ['Fold-down gate', 'Compact design', 'Easy hookup'],
    imageUrl: '/assets/trailers/utility-compact.jpg'
  },
];
router.get('/api/trailers', (req, res) => {
  let filtered = [...trailers];
  const { location, type, minPrice, maxPrice } = req.query;

  if (location) filtered = filtered.filter(t => t.location.toLowerCase() === (location as string).toLowerCase());
  if (type) filtered = filtered.filter(t => t.type.toLowerCase() === (type as string).toLowerCase());
  if (minPrice) filtered = filtered.filter(t => t.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(t => t.price <= Number(maxPrice));

  res.json(filtered);
});

router.get('/api/trailers/:id', (req, res) => {
  const id = Number(req.params.id);
  const trailer = trailers.find(t => t.id === id);
  if (!trailer) return res.status(404).json({ error: 'Trailer not found' });
  res.json(trailer);
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
