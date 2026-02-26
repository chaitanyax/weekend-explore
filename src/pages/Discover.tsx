import React, { useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { useListTripsQuery } from '@/features/trips/tripsApi';
import type { Trip } from '@/types';

function TripItem({ t }: { t: Trip }) {
  const dateStr = new Date(t.startDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <Link to={`/trips/${t.id}`} className="group relative block bg-white rounded-2xl overflow-hidden card-hover border border-slate-100 shadow-sm animate-fade-in">
      <div className="h-40 bg-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={t.imageUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'}
          alt={t.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute bottom-3 left-3 z-20">
          <span className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
            {t.locationName.split(',')[0]}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{t.title}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed h-10">{t.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Starts</span>
            <span className="text-sm font-medium text-slate-700">{dateStr}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Budget</span>
            <p className="text-sm font-bold text-indigo-600">₹{t.budget?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {t.attendees.slice(0, 3).map((a, i) => (
              <img
                key={i}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                src={`https://i.pravatar.cc/100?u=${a.email}`}
                alt={a.name}
              />
            ))}
            {t.attendees.length > 3 && (
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-[10px] font-medium text-slate-500 ring-2 ring-white">
                +{t.attendees.length - 3}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-slate-500 italic">
            {t.attendees.length} {t.attendees.length === 1 ? 'is' : 'are'} going
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Discover() {
  const [query, setQuery] = useState('');
  const [pending, startTransition] = useTransition();
  const { data, isLoading } = useListTripsQuery(query ? { q: query } : undefined);

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-8 px-8 md:px-12 lg:px-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Find your next <span className="text-indigo-600">adventure</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Join hand-picked weekend getaways and experiences led by passionate people.
        </p>

        <div className="max-w-xl mx-auto relative group mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden px-4 py-1">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full px-4 py-3 focus:outline-none text-slate-900 placeholder:text-slate-400"
              placeholder="Search by place, activity, or tag..."
              value={query}
              onChange={(e) => startTransition(() => setQuery(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900">Featured Weekends</h2>
          <div className="h-px flex-1 bg-slate-100 mx-6 hidden md:block" />
          <Link to="/trips/new" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center">
            Host a Trip
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 mb-4 text-lg">No adventures found matching your search.</p>
            <button
              onClick={() => setQuery('')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((t) => (
              <TripItem key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
