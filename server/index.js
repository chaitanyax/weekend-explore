import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db, { seed } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
seed();

import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory if it exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();
    const avatarUrl = `https://i.pravatar.cc/150?u=${email}`;

    db.prepare('INSERT INTO users (id, name, email, password, avatarUrl) VALUES (?, ?, ?, ?, ?)').run(
      userId, name, email, hashedPassword, avatarUrl
    );

    const token = jwt.sign({ id: userId, email, name, avatarUrl }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email, avatarUrl } });
  } catch (e) {
    res.status(500).json({ error: 'Registration failed', detail: String(e) });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed', detail: String(e) });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  // Placeholder for real email reset logic
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  res.json({ message: 'If this email exists, a reset link has been sent (mock).' });
});

app.get('/api/trips', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  let stmt;
  let params = [];

  if (q) {
    stmt = db.prepare(`
      SELECT t.*,
        (SELECT json_group_array(json_object('id', u.id, 'name', u.name, 'email', u.email))
         FROM trip_attendees ta
         JOIN users u ON ta.userId = u.id
         WHERE ta.tripId = t.id) as attendees
      FROM trips t
      WHERE lower(t.title) LIKE ?
         OR lower(t.locationName) LIKE ?
         OR lower(t.tags) LIKE ?
    `);
    const likeQ = `%${q}%`;
    params = [likeQ, likeQ, likeQ];
  } else {
    stmt = db.prepare(`
      SELECT t.*,
        (SELECT json_group_array(json_object('id', u.id, 'name', u.name, 'email', u.email))
         FROM trip_attendees ta
         JOIN users u ON ta.userId = u.id
         WHERE ta.tripId = t.id) as attendees
      FROM trips t
      ORDER BY t.startDate ASC
    `);
  }

  const rows = stmt.all(...params);
  const formatted = rows.map(r => ({
    ...r,
    tags: JSON.parse(r.tags || '[]'),
    attendees: JSON.parse(r.attendees || '[]')
  }));

  res.json(formatted);
});

app.get('/api/trips/:id', (req, res) => {
  const trip = db.prepare(`
    SELECT t.*,
      (SELECT json_group_array(json_object('id', u.id, 'name', u.name, 'email', u.email))
       FROM trip_attendees ta
       JOIN users u ON ta.userId = u.id
       WHERE ta.tripId = t.id) as attendees
    FROM trips t
    WHERE t.id = ?
  `).get(req.params.id);

  if (!trip) return res.status(404).json({ error: 'Not found' });

  res.json({
    ...trip,
    tags: JSON.parse(trip.tags || '[]'),
    attendees: JSON.parse(trip.attendees || '[]')
  });
});

app.post('/api/trips', authMiddleware, (req, res) => {
  const body = req.body || {};
  const required = ['title', 'locationName', 'lat', 'lng', 'startDate', 'endDate'];
  for (const k of required) {
    if (body[k] === undefined || body[k] === null || body[k] === '') {
      return res.status(400).json({ error: `Missing field ${k}` });
    }
  }
  const id = randomUUID();
  const organizerId = req.user.id;
  const tags = JSON.stringify(Array.isArray(body.tags) ? body.tags : []);

  db.prepare(`
    INSERT INTO trips (id, title, description, imageUrl, locationName, lat, lng, startDate, endDate, budget, tags, capacity, organizerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, body.title, body.description || '', body.imageUrl || null, body.locationName,
    Number(body.lat), Number(body.lng), body.startDate, body.endDate,
    body.budget ? Number(body.budget) : null, tags,
    body.capacity ? Number(body.capacity) : null, organizerId
  );

  db.prepare('INSERT INTO trip_attendees (tripId, userId) VALUES (?, ?)').run(id, organizerId);

  res.status(201).json({ id, ...body, organizerId });
});

app.post('/api/trips/:id/join', authMiddleware, (req, res) => {
  const tripId = req.params.id;
  const userId = req.user.id;

  const trip = db.prepare('SELECT id FROM trips WHERE id = ?').get(tripId);
  if (!trip) return res.status(404).json({ error: 'Not found' });

  const exists = db.prepare('SELECT 1 FROM trip_attendees WHERE tripId = ? AND userId = ?').get(tripId, userId);
  if (!exists) {
    db.prepare('INSERT INTO trip_attendees (tripId, userId) VALUES (?, ?)').run(tripId, userId);
  }

  res.json({ success: true });
});

// Handle SPA routing - send all non-API requests to index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
      if (err) {
        res.status(404).json({ error: 'Not found and client-side build missing' });
      }
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});
