-- Projects table
create table if not exists public.projects (
  id text primary key,
  name text not null,
  client text not null,
  status text not null check (status in ('Active','On Hold','Done')),
  deadline date not null
);

-- Tiles table
create table if not exists public.tiles (
  id text primary key,
  name text not null,
  status text not null check (status in ('W KOLEJCE','W TRAKCIE CIĘCIA','WYCIĘTE')),
  project text references public.projects(id) on delete set null,
  priority text check (priority in ('Wysoki','Średni','Niski'))
);
