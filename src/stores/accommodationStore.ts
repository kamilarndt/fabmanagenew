import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchWithMockFallback, mockData } from "../lib/api";
import type {
  Booking,
  BookingApiResponse,
  BookingSearch,
  Hotel,
  Room,
} from "../types/accommodation.types";

interface AccommodationState {
  hotels: Hotel[];
  rooms: Room[];
  bookings: Booking[];
  searchResults: Hotel[];

  isLoading: boolean;
  error: string | null;

  // Actions
  fetchHotels: () => Promise<void>;
  addHotel: (
    hotel: Omit<Hotel, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateHotel: (id: string, hotel: Partial<Hotel>) => Promise<void>;
  deleteHotel: (id: string) => Promise<void>;

  fetchRooms: (hotelId: string) => Promise<void>;
  addRoom: (
    room: Omit<Room, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateRoom: (id: string, room: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;

  fetchBookings: () => Promise<void>;
  addBooking: (
    booking: Omit<Booking, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  searchHotels: (searchParams: BookingSearch) => Promise<BookingApiResponse>;
  bookHotel: (
    booking: Omit<Booking, "id" | "created_at" | "updated_at">
  ) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

export const useAccommodationStore = create<AccommodationState>()(
  immer((set) => ({
    hotels: [],
    rooms: [],
    bookings: [],
    searchResults: [],

    isLoading: false,
    error: null,

    fetchHotels: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await fetch("/api/accommodation/hotels");
        const hotels = await response.json();

        set((state) => {
          state.hotels = hotels;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Unknown error";
          state.isLoading = false;
        });
      }
    },

    addHotel: async (hotelData) => {
      try {
        const response = await fetch("/api/accommodation/hotels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hotelData),
        });
        const hotel = await response.json();

        set((state) => {
          state.hotels.push(hotel);
        });
      } catch (error) {
        throw error;
      }
    },

    updateHotel: async (id, hotelData) => {
      try {
        const response = await fetch(`/api/accommodation/hotels/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hotelData),
        });
        const hotel = await response.json();

        set((state) => {
          const index = state.hotels.findIndex((h: Hotel) => h.id === id);
          if (index !== -1) {
            state.hotels[index] = { ...state.hotels[index], ...hotel };
          }
        });
      } catch (error) {
        throw error;
      }
    },

    deleteHotel: async (id) => {
      try {
        const response = await fetch(`/api/accommodation/hotels/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete hotel");

        set((state) => {
          state.hotels = state.hotels.filter((h: Hotel) => h.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },

    fetchRooms: async (hotelId) => {
      try {
        const response = await fetch(
          `/api/accommodation/hotels/${hotelId}/rooms`
        );
        const rooms = await response.json();

        set((state) => {
          state.rooms = rooms;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Unknown error";
        });
      }
    },

    addRoom: async (roomData) => {
      try {
        const response = await fetch("/api/accommodation/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        });
        const room = await response.json();

        set((state) => {
          state.rooms.push(room);
        });
      } catch (error) {
        throw error;
      }
    },

    updateRoom: async (id, roomData) => {
      try {
        const response = await fetch(`/api/accommodation/rooms/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        });
        const room = await response.json();

        set((state) => {
          const index = state.rooms.findIndex((r: any) => r.id === id);
          if (index !== -1) {
            state.rooms[index] = { ...state.rooms[index], ...room };
          }
        });
      } catch (error) {
        throw error;
      }
    },

    deleteRoom: async (id) => {
      try {
        const response = await fetch(`/api/accommodation/rooms/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete room");

        set((state) => {
          state.rooms = state.rooms.filter((r: any) => r.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },

    fetchBookings: async () => {
      try {
        const bookings = await fetchWithMockFallback(
          "/api/accommodation/bookings",
          mockData.accommodation.bookings
        );

        set((state) => {
          state.bookings = bookings;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Unknown error";
        });
      }
    },

    addBooking: async (bookingData) => {
      try {
        const response = await fetch("/api/accommodation/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
        const booking = await response.json();

        set((state) => {
          state.bookings.push(booking);
        });
      } catch (error) {
        throw error;
      }
    },

    updateBooking: async (id, bookingData) => {
      try {
        const response = await fetch(`/api/accommodation/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
        const booking = await response.json();

        set((state) => {
          const index = state.bookings.findIndex((b: Booking) => b.id === id);
          if (index !== -1) {
            state.bookings[index] = { ...state.bookings[index], ...booking };
          }
        });
      } catch (error) {
        throw error;
      }
    },

    deleteBooking: async (id) => {
      try {
        const response = await fetch(`/api/accommodation/bookings/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete booking");

        set((state) => {
          state.bookings = state.bookings.filter((b: Booking) => b.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },

    searchHotels: async (searchParams) => {
      try {
        const response = await fetch("/api/accommodation/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchParams),
        });
        const result = await response.json();

        set((state) => {
          state.searchResults = result.hotels;
        });

        return result;
      } catch (error) {
        throw error;
      }
    },

    bookHotel: async (bookingData) => {
      try {
        const response = await fetch("/api/accommodation/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
        const booking = await response.json();

        set((state) => {
          state.bookings.push(booking);
        });

        return booking;
      } catch (error) {
        throw error;
      }
    },

    cancelBooking: async (bookingId) => {
      try {
        const response = await fetch(
          `/api/accommodation/bookings/${bookingId}/cancel`,
          {
            method: "POST",
          }
        );

        if (!response.ok) throw new Error("Failed to cancel booking");

        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index].status = "cancelled";
          }
        });
      } catch (error) {
        throw error;
      }
    },
  }))
);
