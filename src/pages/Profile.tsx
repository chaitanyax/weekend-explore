import React from 'react';
import { useAppSelector } from '@/hooks';
import { useListTripsQuery } from '@/features/trips/tripsApi';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth);
  const { data: trips, isLoading } = useListTripsQuery();

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-slate-500 font-medium">Please sign in to view your profile.</p>
      <Link to="/signin" className="px-6 py-2 grad-primary text-white rounded-xl font-bold hover:shadow-lg transition-all">Sign In</Link>
    </div>
  );

  const myTrips = (trips || []).filter(
    (t) => t.organizerId === user.id || t.attendees.some((a) => a.id === user.id)
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 animate-fade-in">
      {/* Profile Header */}
      <div className="relative glass rounded-[32px] p-8 md:p-12 overflow-hidden border border-slate-200 shadow-xl shadow-indigo-500/5">
        <div className="absolute top-0 right-0 w-64 h-64 grad-primary opacity-[0.03] rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative group">
            <div className="absolute -inset-1.5 grad-primary rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="relative h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-sm" />
            ) : (
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full grad-primary grid place-items-center text-3xl font-bold text-white border-4 border-white shadow-sm">
                {user.name?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-1">Explorer Account</div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
            <p className="text-slate-500 text-lg">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Trips Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">My Weekend Adventures <span className="text-indigo-400 font-medium ml-1">({myTrips.length})</span></h2>
          <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Find more +</Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2].map(i => <div key={i} className="h-40 bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />)}
          </div>
        ) : myTrips.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium mb-4">You haven't joined any adventures yet.</p>
            <Link to="/" className="text-indigo-600 font-bold hover:underline">Explore upcoming weekends</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {myTrips.map((t) => (
              <Link
                key={t.id}
                to={`/trips/${t.id}`}
                className="group relative glass hover:bg-white rounded-2xl p-6 border border-slate-100 card-hover shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.title}</h3>
                    <div className="flex items-center text-slate-400 text-xs">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {t.locationName}
                    </div>
                  </div>
                  {t.organizerId === user.id && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-tight border border-amber-100">Organizer</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Date</span>
                    <span className="text-xs font-semibold text-slate-600 italic">
                      {new Date(t.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
