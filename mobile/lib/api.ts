import type { Listing, ListingDetail, User } from "./types";

// Update this to your deployed URL or local dev URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return request("/api/mobile/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return request("/api/mobile/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getMe(token: string): Promise<{ user: User }> {
  return request("/api/mobile/me", {}, token);
}

// ── Listings ────────────────────────────────────────────

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getListings(params: {
  q?: string;
  city?: string;
  state?: string;
  style?: string;
  walkIns?: boolean;
  claimedOnly?: boolean;
  page?: number;
}): Promise<ListingsResponse> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.city) qs.set("city", params.city);
  if (params.state) qs.set("state", params.state);
  if (params.style) qs.set("style", params.style);
  if (params.walkIns) qs.set("walkIns", "true");
  if (params.claimedOnly) qs.set("claimedOnly", "true");
  if (params.page) qs.set("page", String(params.page));
  return request(`/api/mobile/listings?${qs}`);
}

export async function getListing(slug: string): Promise<{ listing: ListingDetail }> {
  return request(`/api/mobile/listings/${encodeURIComponent(slug)}`);
}

export interface NearbyResponse {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
  nearestCities: { id: number; name: string; distance: number }[];
}

export async function getNearbyListings(params: {
  lat: number;
  lng: number;
  radius?: number;
  style?: string;
  walkIns?: boolean;
  page?: number;
}): Promise<NearbyResponse> {
  const qs = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
  });
  if (params.radius) qs.set("radius", String(params.radius));
  if (params.style) qs.set("style", params.style);
  if (params.walkIns) qs.set("walkIns", "true");
  if (params.page) qs.set("page", String(params.page));
  return request(`/api/mobile/listings/nearby?${qs}`);
}

export async function getMyListings(
  token: string
): Promise<{ listings: Listing[] }> {
  return request("/api/mobile/me/listings", {}, token);
}
