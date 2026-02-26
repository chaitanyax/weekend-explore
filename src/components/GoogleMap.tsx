import React from 'react';
import { GoogleMap as GMap, Marker, useJsApiLoader } from '@react-google-maps/api';

type LatLng = { lat: number; lng: number };

interface Props {
  center: LatLng;
  height?: number | string;
  zoom?: number;
  marker?: LatLng | null;
  onClick?(coords: LatLng): void;
}

export default function GoogleMap({ center, height = 320, zoom = 11, marker, onClick }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) return <div className="w-full" style={{ height }}>Loading map…</div>;

  return (
    <div className="w-full rounded overflow-hidden border" style={{ height }}>
      <GMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onClick={(e) => {
          if (!onClick) return;
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (typeof lat === 'number' && typeof lng === 'number') onClick({ lat, lng });
        }}
      >
        {marker && <Marker position={marker} />}
      </GMap>
    </div>
  );
}

export type { LatLng };
