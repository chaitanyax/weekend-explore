# 🗺️ Weekend Explore

[![Live Demo](https://img.shields.io/badge/Live-Demo-indigo?style=for-the-badge&logo=render)](https://weekend-explore.onrender.com/)

A premium, high-performance web application designed to help people discover and host local weekend getaways and social adventures. Built with **React 18**, **Vite**, **TypeScript**, and a persistent **SQLite** backend.


## 🚀 Key Features

- **🏠 Modern Discovery**: Browse through community-hosted events with high-quality imagery and real-time search.
- **✨ Premium UI/UX**: Professional design system using **Outfit** typography, **Glassmorphism**, and smooth transitions.
- **🔐 Secure Auth**: custom-built registration and login system with **bcrypt** password hashing and **JWT** sessions.
- **📍 Map Integration**: Real-time Google Maps integration for trip locations and meeting points.
- **🛠️ Persistent Storage**: Full **SQLite** implementation for local data persistence (trips, users, attendees).
- **👤 User Profiles**: Manage your personal profile, hosted trips, and upcoming weekend adventures.
- **📱 Mobile-First Design**: Optimized for everything from small smartphones to large desktop displays.

## 🛠️ Technology Stack

- **Frontend**: React 18, Redux Toolkit, RTK Query, Tailwind CSS, React Router v6.
- **Backend**: Node.js, Express, **better-sqlite3**, **bcrypt** for security.
- **Auth**: Custom Email/Password + JWT.
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
