import type { Listing, Category, City, State } from "@prisma/client";

export type ListingWithRelations = Listing & {
  city: City & { state: State };
  state: State;
  categories: { category: Category }[];
};

export type CategoryWithCount = Category & {
  _count: { listings: number };
};

export type CityWithCount = City & {
  state: State;
  _count: { listings: number };
};

export type StateWithCount = State & {
  _count: { cities: number; listings: number };
};

export type SearchParams = {
  q?: string;
  city?: string;
  category?: string;
  price?: string;
  style?: string;
  walkIns?: string;
  sort?: string;
  page?: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
