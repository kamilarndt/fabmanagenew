export interface TransportRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number; // in kilometers
  estimated_duration: number; // in minutes
  cost_per_km: number;
  total_cost: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'car' | 'trailer';
  capacity: number; // in cubic meters or weight
  fuel_consumption: number; // liters per 100km
  daily_rate: number;
  is_available: boolean;
  current_location?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  name: string;
  license_number: string;
  license_type: string;
  phone: string;
  email: string;
  is_available: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface TransportJob {
  id: string;
  project_id: string;
  route_id: string;
  route?: TransportRoute;
  vehicle_id: string;
  vehicle?: Vehicle;
  driver_id: string;
  driver?: Driver;
  cargo_description: string;
  weight: number; // in kg
  volume: number; // in cubic meters
  pickup_date: string;
  delivery_date: string;
  status: 'scheduled' | 'in_progress' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RouteOptimization {
  id: string;
  name: string;
  routes: string[];
  total_distance: number;
  total_duration: number;
  total_cost: number;
  fuel_consumption: number;
  co2_emissions: number;
  created_at: string;
  updated_at: string;
}
