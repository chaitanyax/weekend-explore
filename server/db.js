import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    avatarUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    imageUrl TEXT,
    locationName TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    budget REAL,
    tags TEXT, -- Store as JSON string
    capacity INTEGER,
    organizerId TEXT NOT NULL,
    FOREIGN KEY (organizerId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS trip_attendees (
    tripId TEXT NOT NULL,
    userId TEXT NOT NULL,
    PRIMARY KEY (tripId, userId),
    FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Seeding function
export function seed() {
  const count = db.prepare('SELECT COUNT(*) as count FROM trips').get().count;
  if (count > 0) return;

  console.log('Seeding initial sample event...');

  const sampleOrganizerId = randomUUID();
  db.prepare('INSERT INTO users (id, name, email, avatarUrl) VALUES (?, ?, ?, ?)').run(
    sampleOrganizerId, 'Founder', 'admin@weekendexplore.com', 'https://i.pravatar.cc/150?u=admin'
  );

  const tripId = randomUUID();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 4);

  db.prepare(`
    INSERT INTO trips (id, title, description, imageUrl, locationName, lat, lng, startDate, endDate, budget, tags, capacity, organizerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    tripId,
    'Grand Inaugural Trek: Nandi Hills',
    'Join the Weekend Explore community for our first official community trek! Perfect for networking and enjoying a crisp sunrise.',
    'https://images.unsplash.com/photo-1551632432-c73581c61966?auto=format&fit=crop&q=80&w=800',
    'Nandi Hills',
    13.3702, 77.6835,
    startDate.toISOString(),
    endDate.toISOString(),
    0,
    JSON.stringify(['nature', 'community']),
    50,
    sampleOrganizerId
  );

  db.prepare('INSERT INTO trip_attendees (tripId, userId) VALUES (?, ?)').run(tripId, sampleOrganizerId);

  console.log('Seeding complete.');
}
export default db;
