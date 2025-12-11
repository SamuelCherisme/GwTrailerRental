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
      trailers: '/api/trailers'
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
  { id: 1, title: 'Trailer A', location: 'Atlanta', type: 'Utility', price: 200, description: 'Lightweight utility trailer' },
  { id: 2, title: 'Trailer B', location: 'Dallas', type: 'Flatbed', price: 300, description: 'Heavy-duty flatbed trailer' },
  { id: 3, title: 'Trailer C', location: 'Atlanta', type: 'Enclosed', price: 400, description: 'Secure enclosed trailer' },
  { id: 4, title: 'Trailer D', location: 'Miami', type: 'Utility', price: 150, description: 'Compact utility trailer' },
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
