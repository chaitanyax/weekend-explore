import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAppDispatch, useAppSelector } from './hooks';
import { setUser } from './features/auth/authSlice';

// Dynamic imports for pages
const Discover = React.lazy(() => import('./pages/Discover'));
const TripDetail = React.lazy(() => import('./pages/TripDetail'));
const CreateTrip = React.lazy(() => import('./pages/CreateTrip'));
const Profile = React.lazy(() => import('./pages/Profile'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

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
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route
              path="/trips/new"
              element={
                <RequireAuth>
                  <CreateTrip />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="py-10 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          © 2026 Weekend Explore. Built for the community.
        </div>
      </footer>
    </div>
  );
}
