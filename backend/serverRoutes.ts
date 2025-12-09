import { Router } from 'express';
const router = Router();

// Root route (just to test backend is running)
router.get('/', (req, res) => {
  res.send('Backend is running');
});


const trailers = [
  { id: 1, title: 'Trailer A', location: 'Atlanta', type: 'Utility', price: 200, description: 'Lightweight utility trailer' },
  { id: 2, title: 'Trailer B', location: 'Dallas', type: 'Flatbed', price: 300, description: 'Heavy-duty flatbed trailer' },
  { id: 3, title: 'Trailer C', location: 'Atlanta', type: 'Enclosed', price: 400, description: 'Secure enclosed trailer' },
  { id: 4, title: 'Trailer D', location: 'Miami', type: 'Utility', price: 150, description: 'Compact utility trailer' },
];

// Example route: get trailers
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

// Example route: contact form
router.post('/api/contact', (req, res) => {
  console.log(req.body);
  res.status(200).send({ success: true });
});

export default router;
