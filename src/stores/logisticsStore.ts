import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchWithMockFallback, mockData } from "../lib/api";
import type {
  Driver,
  RouteOptimization,
  TransportJob,
  TransportRoute,
  Vehicle,
} from "../types/logistics.types";

interface LogisticsState {
  routes: TransportRoute[];
  vehicles: Vehicle[];
  drivers: Driver[];
  jobs: TransportJob[];
  optimizations: RouteOptimization[];

  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRoutes: () => Promise<void>;
  addRoute: (
    route: Omit<TransportRoute, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateRoute: (id: string, route: Partial<TransportRoute>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;

  fetchVehicles: () => Promise<void>;
  addVehicle: (
    vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

  fetchDrivers: () => Promise<void>;
  addDriver: (
    driver: Omit<Driver, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;

  fetchJobs: () => Promise<void>;
  addJob: (
    job: Omit<TransportJob, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateJob: (id: string, job: Partial<TransportJob>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;

  optimizeRoutes: (routeIds: string[]) => Promise<RouteOptimization>;
  calculateRouteCost: (routeId: string) => Promise<number>;
}

export const useLogisticsStore = create<LogisticsState>()(
  immer((set) => ({
    routes: [],
    vehicles: [],
    drivers: [],
    jobs: [],
    optimizations: [],

    isLoading: false,
    error: null,

    fetchRoutes: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const routes = await fetchWithMockFallback(
          "/api/logistics/routes",
          mockData.logistics.routes
        );

        set((state) => {
          state.routes = routes;
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

    addRoute: async (routeData) => {
      try {
        const response = await fetch("/api/logistics/routes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(routeData),
        });
        const route = await response.json();

        set((state) => {
          state.routes.push(route);
        });
      } catch (error) {
        throw error;
      }
    },

    updateRoute: async (id, routeData) => {
      try {
        const response = await fetch(`/api/logistics/routes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(routeData),
        });
        const route = await response.json();

        set((state) => {
          const index = state.routes.findIndex((r) => r.id === id);
          if (index !== -1) {
            state.routes[index] = { ...state.routes[index], ...route };
          }
        });
      } catch (error) {
        throw error;
      }
    },

    deleteRoute: async (id) => {
      try {
        const response = await fetch(`/api/logistics/routes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete route");

        set((state) => {
          state.routes = state.routes.filter((r) => r.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },

    fetchVehicles: async () => {
      try {
        const vehicles = await fetchWithMockFallback(
          "/api/logistics/vehicles",
          mockData.logistics.vehicles
        );

        set((state) => {
          state.vehicles = vehicles;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Unknown error";
        });
      }
    },

    addVehicle: async (vehicleData) => {
      try {
        const response = await fetch("/api/logistics/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicleData),
        });
        const vehicle = await response.json();

        set((state) => {
          state.vehicles.push(vehicle);
        });
      } catch (error) {
        throw error;
      }
    },

    updateVehicle: async (id, vehicleData) => {
      try {
        const response = await fetch(`/api/logistics/vehicles/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicleData),
        });
        const vehicle = await response.json();

        set((state) => {
          const index = state.vehicles.findIndex((v) => v.id === id);
          if (index !== -1) {
            state.vehicles[index] = { ...state.vehicles[index], ...vehicle };
          }
        });
      } catch (error) {
        throw error;
      }
    },

    deleteVehicle: async (id) => {
      try {
        const response = await fetch(`/api/logistics/vehicles/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete vehicle");

        set((state) => {
          state.vehicles = state.vehicles.filter((v) => v.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },

    fetchDrivers: async () => {
      try {
        const drivers = await fetchWithMockFallback(
          "/api/logistics/drivers",
          mockData.logistics.drivers
        );

        set((state) => {
          state.drivers = drivers;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Unknown error";
        });
      }
    },

    addDriver: async (driverData) => {
      try {
        const response = await fetch("/api/logistics/drivers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(driverData),
        });
        const driver = await response.json();

        set((state) => {
          state.drivers.push(driver);
        });
      } catch (error) {
        throw error;
      }
    },

    updateDriver: async (id, driverData) => {
      try {
        const response = await fetch(`/api/logistics/drivers/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(driverData),
        });
        const driver = await response.json();

        set((state) => {
          const index = state.drivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            state.drivers[index] = { ...state.drivers[index], ...driver };
          }
        });
      } catch (error) {
        throw error;
      }
    },

    deleteDriver: async (id) => {
      try {
        const response = await fetch(`/api/logistics/drivers/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete driver");

        set((state) => {
          state.drivers = state.drivers.filter((d) => d.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },

    fetchJobs: async () => {
      try {
        const jobs = await fetchWithMockFallback(
          "/api/logistics/jobs",
          mockData.logistics.jobs
        );

        set((state) => {
          state.jobs = jobs;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error ? error.message : "Unknown error";
        });
      }
    },

    addJob: async (jobData) => {
      try {
        const response = await fetch("/api/logistics/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });
        const job = await response.json();

        set((state) => {
          state.jobs.push(job);
        });
      } catch (error) {
        throw error;
      }
    },

    updateJob: async (id, jobData) => {
      try {
        const response = await fetch(`/api/logistics/jobs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        });
        const job = await response.json();

        set((state) => {
          const index = state.jobs.findIndex((j) => j.id === id);
          if (index !== -1) {
            state.jobs[index] = { ...state.jobs[index], ...job };
          }
        });
      } catch (error) {
        throw error;
      }
    },

    deleteJob: async (id) => {
      try {
        const response = await fetch(`/api/logistics/jobs/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete job");

        set((state) => {
          state.jobs = state.jobs.filter((j) => j.id !== id);
        });
      } catch (error) {
        throw error;
      }
    },

    optimizeRoutes: async (routeIds) => {
      try {
        const response = await fetch("/api/logistics/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routeIds }),
        });
        const optimization = await response.json();

        set((state) => {
          state.optimizations.push(optimization);
        });

        return optimization;
      } catch (error) {
        throw error;
      }
    },

    calculateRouteCost: async (routeId) => {
      try {
        const response = await fetch(`/api/logistics/routes/${routeId}/cost`);
        const { cost } = await response.json();
        return cost;
      } catch (error) {
        throw error;
      }
    },
  }))
);
