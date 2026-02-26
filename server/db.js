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
    avatarUrl TEXT,
    age INTEGER,
    gender TEXT,
    hobbies TEXT -- JSON string
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
  // Empty seed to allow real-time community usage from scratch
  console.log('Database initialized. Ready for community hosting.');
}
export default db;
