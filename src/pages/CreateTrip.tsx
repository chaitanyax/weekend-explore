import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GoogleMap, { LatLng } from '@/components/GoogleMap';
import { useCreateTripMutation } from '@/features/trips/tripsApi';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  locationName: z.string().min(2, 'Enter a location name'),
  lat: z.number({ invalid_type_error: 'Select a point on map' }),
  lng: z.number({ invalid_type_error: 'Select a point on map' }),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  budget: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().positive().optional()),
  tags: z.preprocess((v) =>
    typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : Array.isArray(v) ? v : []
    , z.array(z.string()).optional()),
  capacity: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().int().positive().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function CreateTrip() {
  const navigate = useNavigate();
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [center, setCenter] = useState<LatLng>({ lat: 12.9716, lng: 77.5946 });
  const [createTrip, { isLoading }] = useCreateTripMutation();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '', description: '', imageUrl: '', locationName: '', startDate: '', endDate: '', budget: undefined, tags: [], capacity: undefined,
    },
  });

  const watchedImageUrl = watch('imageUrl');

  useEffect(() => {
    if (marker) {
      setValue('lat', marker.lat as unknown as never);
      setValue('lng', marker.lng as unknown as never);
    }
  }, [marker, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await createTrip({
        ...values,
        tags: Array.isArray(values.tags) ? values.tags : [],
      }).unwrap();
      navigate(`/trips/${res.id}`);
    } catch (e) {
      console.error('Failed to create trip:', e);
    }
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Host an <span className="text-grad">Adventure</span></h1>
        <p className="text-slate-500 max-w-lg mx-auto">Fill in the details below to create a new weekend experience and build your community.</p>
      </div>

      <div className="glass rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 border border-slate-200">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Trip title</label>
                <input
                  className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="e.g. Sunrise Trek at Nandi Hills"
                  {...register('title')}
                />
                {errors.title && <p className="text-[11px] font-bold text-red-500 mt-1 uppercase tracking-wider">{errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Location name</label>
                <input
                  className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="e.g. Nandi Hills, South Bangalore"
                  {...register('locationName')}
                />
                {errors.locationName && <p className="text-[11px] font-bold text-red-500 mt-1 uppercase tracking-wider">{errors.locationName.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Start Date</label>
                <input
                  type="datetime-local"
                  className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  {...register('startDate')}
                />
                {errors.startDate && <p className="text-[11px] font-bold text-red-500 mt-1 uppercase tracking-wider">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">End Date</label>
                <input
                  type="datetime-local"
                  className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  {...register('endDate')}
                />
                {errors.endDate && <p className="text-[11px] font-bold text-red-500 mt-1 uppercase tracking-wider">{errors.endDate.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Experience Details</h2>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400 min-h-[120px]"
                placeholder="Tell people what to expect, what to bring, and why they should join!"
                rows={4}
                {...register('description')}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Image URL (Optional)</label>
              <input
                className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="Paste an Unsplash or high-res image URL"
                {...register('imageUrl')}
              />
              {watchedImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden h-40 border border-slate-100 shadow-sm transition-all animate-fade-in">
                  <img src={watchedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Budget (₹)</label>
                <input type="number" className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" {...register('budget')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Capacity</label>
                <input type="number" className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" {...register('capacity')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tags</label>
                <input className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 placeholder:text-slate-400" placeholder="trek, food, morning" {...register('tags' as any)} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">Meeting Point</h2>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <GoogleMap center={marker || center} marker={marker} onClick={(p) => setMarker(p)} height={320} />
            </div>
            {(errors.lat || errors.lng) && <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">{errors.lat?.message || errors.lng?.message}</p>}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              disabled={isLoading}
              type="submit"
              className="flex-1 grad-primary text-white h-14 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Creating Adventure...' : 'Launch Trip'}
            </button>
            <button
              type="button"
              className="px-8 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
