import { baseApi } from '@/app/baseApi';
import type { CreateTripInput, Trip } from '@/types';

export const tripsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTrips: build.query<Trip[], { q?: string } | void>({
      query: (args) => {
        const q = args && args.q ? `?q=${encodeURIComponent(args.q)}` : '';
        return `/trips${q}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Trip' as const, id })),
              { type: 'Trip' as const, id: 'LIST' },
            ]
          : [{ type: 'Trip' as const, id: 'LIST' }],
    }),
    getTrip: build.query<Trip, string>({
      query: (id) => `/trips/${id}`,
      providesTags: (result, _e, id) => [{ type: 'Trip', id }],
    }),
    createTrip: build.mutation<Trip, CreateTripInput>({
      query: (body) => ({
        url: '/trips',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Trip', id: 'LIST' }],
    }),
    joinTrip: build.mutation<Trip, { id: string }>({
      query: ({ id }) => ({ url: `/trips/${id}/join`, method: 'POST' }),
      invalidatesTags: (_res, _e, { id }) => [
        { type: 'Trip', id },
        { type: 'Trip', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListTripsQuery,
  useGetTripQuery,
  useCreateTripMutation,
  useJoinTripMutation,
} = tripsApi;
