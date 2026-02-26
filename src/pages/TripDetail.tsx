import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTripQuery, useJoinTripMutation } from '@/features/trips/tripsApi';
import GoogleMap from '@/components/GoogleMap';
import { useAppSelector } from '@/hooks';

export default function TripDetail() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useGetTripQuery(id);
  const { user } = useAppSelector((s) => s.auth);
  const [joinTrip, { isLoading: joining }] = useJoinTripMutation();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (isError || !data) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-slate-900">Adventure not found</h2>
      <p className="text-slate-500 mt-2">The trip you are looking for might have been moved or deleted.</p>
      <Link to="/" className="inline-block mt-6 text-indigo-600 font-bold hover:underline">Return to Discovery</Link>
    </div>
  );

  const isMember = !!user && data.attendees.some((a) => a.id === user.id);
  const dateStr = `${new Date(data.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} - ${new Date(data.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  return (
    <section className="max-w-6xl mx-auto py-8 px-4 animate-fade-in space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden h-[400px] shadow-2xl">
        <img
          src={data.imageUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex gap-2">
              {data.tags?.map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30 uppercase tracking-widest">
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight shadow-sm">{data.title}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-1.5 font-medium">
                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {data.locationName}
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dateStr}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 inline-flex flex-col">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-tight">Per Person</span>
              <span className="text-white text-2xl font-black">₹{data.budget?.toLocaleString()}</span>
            </div>
            {user && !isMember && (
              <button
                disabled={joining}
                onClick={() => joinTrip({ id: data.id })}
                className="w-full md:w-auto px-8 py-3 rounded-2xl bg-white text-indigo-600 font-black shadow-xl shadow-black/10 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {joining ? 'Processing...' : 'Secure Your Spot'}
              </button>
            )}
            {isMember && (
              <div className="px-8 py-3 rounded-2xl bg-indigo-500 text-white font-black border border-indigo-400">
                You're In! 🎉
              </div>
            )}
            {!user && (
              <Link to="/signin" className="px-8 py-3 rounded-2xl bg-white text-indigo-600 font-black hover:scale-[1.02] transition-all">
                Sign in to Join
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6">About this adventure</h2>
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {data.description || 'No description provided for this trip.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Meeting Point</h3>
              <span className="text-xs text-indigo-600 font-bold uppercase tracking-widest">{data.lat}, {data.lng}</span>
            </div>
            <GoogleMap center={{ lat: data.lat, lng: data.lng }} marker={{ lat: data.lat, lng: data.lng }} height={400} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
              Attendees
              <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs">{data.attendees.length} / {data.capacity || '∞'}</span>
            </h2>
            <div className="space-y-3">
              {data.attendees.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <img src={`https://i.pravatar.cc/100?u=${a.email}`} className="w-10 h-10 rounded-full ring-2 ring-transparent group-hover:ring-indigo-100 transition-all" alt={a.name} />
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{a.name}</div>
                    <div className="text-xs text-slate-400">{a.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-black mb-2">Safety First</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              We verify all hosts and ensure safety protocols for every weekend adventure. Have fun with peace of mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
