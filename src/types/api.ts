export interface MediaItem {
  url: string;
  alt?: string;
}

export interface ListingCount {
  bids: number;
}

export interface ProfileCount {
  listings?: number;
  wins?: number;
}

export interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: MediaItem;
  banner?: MediaItem;
  credits: number;
  _count?: ProfileCount;
}

export interface Bid {
  id: string;
  amount: number;
  bidder: Profile;
  created: string;
  listing?: Listing;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  media: MediaItem[];
  created: string;
  updated: string;
  endsAt: string;
  _count: ListingCount;
  seller?: Profile;
  bids?: Bid[];
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateListingBody {
  title: string;
  description?: string;
  tags?: string[];
  media?: MediaItem[];
  endsAt: string;
}

export interface UpdateListingBody {
  title?: string;
  description?: string;
  tags?: string[];
  media?: MediaItem[];
}

export interface UpdateProfileBody {
  bio?: string;
  avatar?: MediaItem;
  banner?: MediaItem;
}

export interface BidBody {
  amount: number;
}

export interface AuthUser extends Profile {
  accessToken: string;
}

export type LoginResponse = ApiResponse<AuthUser>;

export interface ApiMeta {
  isFirstPage?: boolean;
  isLastPage?: boolean;
  currentPage?: number;
  previousPage?: number | null;
  nextPage?: number | null;
  pageCount?: number;
  totalCount?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorItem {
  message: string;
}

export interface ApiErrorResponse {
  errors: ApiErrorItem[];
  status: string;
  statusCode: number;
}
