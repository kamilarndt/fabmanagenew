export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  price_per_night: number;
  currency: string;
  amenities: string[];
  photos: string[];
  booking_api_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  hotel?: Hotel;
  type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  photos: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  project_id: string;
  hotel_id: string;
  hotel?: Hotel;
  room_id: string;
  room?: Room;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingSearch {
  city: string;
  check_in: string;
  check_out: string;
  guests: number;
  rooms: number;
  min_price?: number;
  max_price?: number;
  rating?: number;
}

export interface BookingApiResponse {
  hotels: Hotel[];
  total_results: number;
  search_params: BookingSearch;
}
