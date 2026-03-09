export interface Listing {
  id: number;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  latitude: number | null;
  longitude: number | null;
  styles: string[] | null;
  acceptsWalkIns: boolean;
  priceRange: string | null;
  featured: boolean;
  isClaimed: boolean;
  /** Only present when isClaimed is true */
  photos: string[] | null;
  distanceMiles?: number | null;
  city: string;
  citySlug: string;
  state: string;
  stateName: string;
  stateSlug: string;
  categories: { name: string; slug: string }[];
}

export interface ListingDetail extends Listing {
  description: string | null;
  type: string;
  email: string | null;
  zipCode: string | null;
  minimumAge: number | null;
  piercingServices: boolean;
  tattooRemoval: boolean;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  amenities: string[] | null;
  hours: Record<string, string> | null;
  artists: { name: string; specialties: string[] }[] | null;
  services: string[] | null;
  portfolioUrl: string | null;
  viewCount: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  plan: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
