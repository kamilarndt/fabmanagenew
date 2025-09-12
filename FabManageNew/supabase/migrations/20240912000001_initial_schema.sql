-- Projects table
create table if not exists public.projects (
  id text primary key,
  name text not null,
  client text not null,
  status text not null check (status in ('Active','On Hold','Done')),
  deadline date not null,
  -- Speckle 3D Integration fields
  speckle_stream_url text,
  speckle_stream_id text,
  model_3d_status text default 'not_loaded'
);

-- Tiles table
create table if not exists public.tiles (
  id text primary key,
  name text not null,
  status text not null check (status in ('Do akceptacji','Zaakceptowane','W produkcji CNC','Gotowy do montażu','W KOLEJCE','W TRAKCIE CIĘCIA','WYCIĘTE')),
  project text references public.projects(id) on delete set null,
  priority text check (priority in ('Wysoki','Średni','Niski')),
  -- Speckle 3D Integration fields
  speckle_object_ids jsonb,
  geometry_data jsonb,
  screenshot_url text,
  material_assignments jsonb
);

-- Aggregated materials view (BOM consolidation)
create or replace view public.materials_bom_view as
select
  t.project as project_id,
  (bi->>'name') as name,
  (bi->>'unit') as unit,
  coalesce(sum(((bi->>'quantity')::numeric)),0) as quantity
from public.tiles t
cross join lateral jsonb_array_elements(coalesce(t.bom, '[]'::jsonb)) as bi
group by t.project, (bi->>'name'), (bi->>'unit');

-- Production queue view based on statuses relevant for Kanban
create or replace view public.production_queue_view as
select id, name, status, project
from public.tiles
where status in ('Zaakceptowane','W produkcji CNC','Gotowy do montażu','W KOLEJCE','W TRAKCIE CIĘCIA','WYCIĘTE');

-- New table: tile_materials for detailed material assignments
create table if not exists public.tile_materials (
    id uuid primary key default gen_random_uuid(),
    tile_id text references public.tiles(id) on delete cascade,
    material_id text, -- references materials table when available
    speckle_object_id text,
    volume_m3 decimal(10,6),
    area_m2 decimal(10,4),
    estimated_plates integer,
    waste_percentage decimal(5,2) default 15.0,
    created_at timestamp default now()
);
