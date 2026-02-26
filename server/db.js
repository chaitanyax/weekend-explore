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

  console.log('Seeding 100 events...');

  const seedUsers = [
    { id: 'seed-org-1', name: 'Asha', email: 'asha@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=asha' },
    { id: 'seed-org-2', name: 'Meera', email: 'meera@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=meera' },
    { id: 'seed-3', name: 'Rahul', email: 'rahul@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=rahul' },
    { id: 'seed-4', name: 'Siddharth', email: 'sid@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=sid' },
    { id: 'seed-5', name: 'Priya', email: 'priya@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=priya' },
  ];

  const insertUser = db.prepare('INSERT INTO users (id, name, email, avatarUrl) VALUES (?, ?, ?, ?)');
  seedUsers.forEach(u => {
    try { insertUser.run(u.id, u.name, u.email, u.avatarUrl); } catch (e) { }
  });

  const sampleTitles = [
    'Hiking in {place}', 'Evening Yoga at {place}', 'Tech Talk: {topic} at {place}',
    'Pottery Workshop in {place}', 'Board Game Night at {place}', 'Photography Walk in {place}',
    'Startup Networking at {place}', 'Art & Wine Social in {place}', 'Book Club Meetup at {place}',
    'Stargazing at {place}', 'Gourmet Cooking Class in {place}', 'Cycling Tour through {place}'
  ];

  const places = [
    { name: 'Nandi Hills', lat: 13.3702, lng: 77.6835 },
    { name: 'Cubbon Park', lat: 12.9733, lng: 77.5910 },
    { name: 'Lalbagh', lat: 12.9507, lng: 77.5844 },
    { name: 'HSR Layout', lat: 12.9128, lng: 77.6388 },
    { name: 'Indiranagar', lat: 12.9719, lng: 77.6412 },
    { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
    { name: 'Banaswadi', lat: 13.0012, lng: 77.6455 },
    { name: 'Jayanagar', lat: 12.9250, lng: 77.5938 },
  ];

  const topics = ['React Native', 'AI Safety', 'Sustainable Living', 'Digital Marketing', 'Investment 101', 'Creative Writing'];
  const tagsPool = ['nature', 'fitness', 'tech', 'creativity', 'social', 'food', 'education', 'outdoors'];

  const insertTrip = db.prepare(`
    INSERT INTO trips (id, title, description, imageUrl, locationName, lat, lng, startDate, endDate, budget, tags, capacity, organizerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAttendee = db.prepare('INSERT INTO trip_attendees (tripId, userId) VALUES (?, ?)');

  for (let i = 0; i < 100; i++) {
    const tripId = randomUUID();
    const place = places[Math.floor(Math.random() * places.length)];
    const titleTemplate = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const title = titleTemplate.replace('{place}', place.name).replace('{topic}', topic);

    // Map title to relevant high-quality images
    const imageMap = {
      'Hiking': 'https://images.unsplash.com/photo-1551632432-c73581c61966?auto=format&fit=crop&q=80&w=800',
      'Yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      'Tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      'Pottery': 'https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&q=80&w=800',
      'Board Game': 'https://images.unsplash.com/photo-1610848012300-30f3a79bc98c?auto=format&fit=crop&q=80&w=800',
      'Photography': 'https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&q=80&w=800',
      'Startup': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
      'Art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
      'Book': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800',
      'Stargazing': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
      'Cooking': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
      'Cycling': 'https://images.unsplash.com/photo-1541625602330-2277a1c4b6c3?auto=format&fit=crop&q=80&w=800'
    };

    let imageUrl = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800';
    for (const [key, val] of Object.entries(imageMap)) {
      if (title.includes(key)) {
        imageUrl = val;
        break;
      }
    }
    // Add a unique signature to avoid browser caching same image for different cards if we had duplicates
    imageUrl += `&sig=${i}`;

    const startOffset = Math.floor(Math.random() * 30); // within next 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + startOffset);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 4);

    const budget = Math.floor(Math.random() * 5000) + 500;
    const capacity = Math.floor(Math.random() * 20) + 5;
    const tags = JSON.stringify([
      tagsPool[Math.floor(Math.random() * tagsPool.length)],
      tagsPool[Math.floor(Math.random() * tagsPool.length)]
    ]);
    const organizer = seedUsers[Math.floor(Math.random() * seedUsers.length)];

    insertTrip.run(
      tripId,
      title,
      `Join us for ${title.toLowerCase()}. It's going to be an amazing weekend activity!`,
      imageUrl,
      place.name,
      place.lat,
      place.lng,
      startDate.toISOString(),
      endDate.toISOString(),
      budget,
      tags,
      capacity,
      organizer.id
    );

    // Initial attendee is the organizer
    insertAttendee.run(tripId, organizer.id);

    // Add 1-3 more random attendees
    const numOthers = Math.floor(Math.random() * 3) + 1;
    const others = seedUsers.filter(u => u.id !== organizer.id).sort(() => 0.5 - Math.random()).slice(0, numOthers);
    others.forEach(u => {
      try { insertAttendee.run(tripId, u.id); } catch (e) { }
    });
  }

  console.log('Seeding complete.');
}

export default db;
