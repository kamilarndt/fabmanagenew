CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'szt',
  unit_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  location TEXT
);

CREATE TABLE IF NOT EXISTS tiles (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'designing',
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tile_materials (
  tile_id UUID NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
  quantity NUMERIC(10,3) NOT NULL DEFAULT 0,
  PRIMARY KEY (tile_id, material_id)
);

CREATE TABLE IF NOT EXISTS schedule_tasks (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'planned'
);

CREATE TABLE IF NOT EXISTS design_tasks (
  id UUID PRIMARY KEY,
  tile_id UUID NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  assignee TEXT,
  planned_hours INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cnc_tasks (
  id UUID PRIMARY KEY,
  tile_id UUID NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
  machine TEXT,
  estimated_minutes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'queued',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS production_tasks (
  id UUID PRIMARY KEY,
  tile_id UUID NOT NULL REFERENCES tiles(id) ON DELETE CASCADE,
  station TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS logistics_routes (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  planned_date TIMESTAMPTZ,
  vehicle_type TEXT,
  driver TEXT,
  status TEXT NOT NULL DEFAULT 'planned'
);

CREATE TABLE IF NOT EXISTS packing_lists (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity NUMERIC(10,3) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'szt',
  status TEXT NOT NULL DEFAULT 'packed'
);


