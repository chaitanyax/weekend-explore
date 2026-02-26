import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout } from '@/features/auth/authSlice';

export default function Navbar() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200">
      <nav className="max-w-7xl mx-auto h-[var(--navbar-height)] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 lg:gap-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 grad-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 hidden xs:inline">
              Weekend<span className="text-indigo-600"> Explore</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <NavLink to="/" className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
              Discover
            </NavLink>
            <NavLink to="/trips/new" className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
              Host a Trip
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <NavLink to="/profile" className="flex items-center gap-2 group">
                <img
                  src={user.avatarUrl || `https://i.pravatar.cc/100?u=${user.email}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-slate-100 group-hover:border-indigo-500 transition-colors"
                />
                <span className="text-sm font-bold text-slate-700 hidden lg:block">
                  {user.name?.split(' ')[0] || 'Profile'}
                </span>
              </NavLink>
              <button
                onClick={onLogout}
                className="px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/signin"
                className="text-[12px] sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-2 sm:px-3 py-2"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl grad-primary text-white text-[12px] sm:text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
              >
                Join Now
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
