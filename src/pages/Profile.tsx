import React from 'react';
import { useAppSelector } from '@/hooks';
import { useListTripsQuery } from '@/features/trips/tripsApi';

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth);
  const { data: trips } = useListTripsQuery();

  if (!user) return <p>Please sign in.</p>;

  const myTrips = (trips || []).filter(
    (t) => t.organizerId === user.id || t.attendees.some((a) => a.id === user.id)
  );

  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200 grid place-items-center font-semibold">
            {user.name?.[0] || 'U'}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">My trips ({myTrips.length})</h2>
        {myTrips.length === 0 ? (
          <p className="text-gray-600">You haven't joined any trips yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3">
            {myTrips.map((t) => (
              <li key={t.id} className="rounded border p-3">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-gray-600">{t.locationName}</div>
                <div className="text-xs text-gray-500">{new Date(t.startDate).toLocaleDateString()} → {new Date(t.endDate).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
