import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAppDispatch } from './hooks';
import { setUser } from './features/auth/authSlice';

const Discover = lazy(() => import('./pages/Discover'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const CreateTrip = lazy(() => import('./pages/CreateTrip'));
const Profile = lazy(() => import('./pages/Profile'));
const SignIn = lazy(() => import('./pages/SignIn'));

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('me_jwt');
    if (token) {
      try {
        const [, payload] = token.split('.');
        const data = JSON.parse(atob(payload));
        if (data && data.email) {
          dispatch(setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${data.email}`,
            token
          }));
        }
      } catch { }
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-1 container-page px-4 sm:px-6 md:px-12 lg:px-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/trips/new"
              element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 grad-primary rounded-md" />
            <span className="font-bold text-slate-900">Weekend Explore</span>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Made with ❤️ for weekend adventurers.
          </p>
          <div className="flex gap-6">
            <span className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors text-sm font-medium">Privacy</span>
            <span className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors text-sm font-medium">Terms</span>
            <span className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors text-sm font-medium">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
