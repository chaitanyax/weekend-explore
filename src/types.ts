export type ID = string;

export interface UserProfile {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
  city?: string;
  interests?: string[];
}

export interface Trip {
  id: ID;
  title: string;
  description?: string;
  imageUrl?: string;
  locationName: string;
  lat: number;
  lng: number;
  startDate: string; // ISO
  endDate: string; // ISO
  budget?: number;
  tags?: string[];
  capacity?: number;
  organizerId: ID;
  attendees: UserProfile[];
}

export interface CreateTripInput {
  title: string;
  description?: string;
  locationName: string;
  lat: number;
  lng: number;
  startDate: string; // ISO
  endDate: string; // ISO
  budget?: number;
  tags?: string[];
  capacity?: number;
}
