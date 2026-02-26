# 🗺️ Weekend Explore

A premium, high-performance web application designed to help people discover and host local weekend getaways and social adventures. Built with **React 18**, **Vite**, **TypeScript**, and a persistent **SQLite** backend.

![Weekend Explore Banner](https://images.unsplash.com/photo-1506012733851-bb9795794e75?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

- **🏠 Modern Discovery**: Browse through a curated collection of **100+ seeded events** with beautiful imagery and real-time search.
- **✨ Premium UI/UX**: Professional design system using **Outfit** typography, **Glassmorphism**, and smooth transitions.
- **🔐 Guest Access**: Seamless "Continue as Guest" mode to explore the platform instantly without configuration.
- **📍 Map Integration**: Real-time Google Maps integration for trip locations and meeting points.
- **🛠️ Persistent Storage**: Full **SQLite** implementation for local data persistence (trips, users, attendees).
- **👤 User Profiles**: Manage your hosted trips and upcoming weekend adventures.

## 🛠️ Technology Stack

- **Frontend**: React 18, Redux Toolkit, RTK Query, Tailwind CSS, React Router v6.
- **Backend**: Node.js, Express, **better-sqlite3**.
- **Auth**: Google OAuth 2.0 + JWT (with fallback Demo/Guest mode).
- **Maps**: @react-google-maps/api.

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=4000
JWT_SECRET=your_super_secret_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id (Optional for Guest Mode)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Run the Application
```bash
# Starts both Backend (Port 4000) and Frontend (Port 5173) tasks concurrently
npm run dev:all
```
The server will automatically initialize a `database.sqlite` file and seed it with **100 events** on the first run.

## 📂 Project Structure

- `/src`: Frontend React application.
- `/server`: Node.js/Express server files.
  - `db.js`: SQLite schema and 100-event seeding logic.
  - `index.js`: API endpoints and JWT middleware.
- `/dist`: Optimized production build.

## 📄 License
© 2026 Weekend Explore. Built for weekend adventurers and community builders.
