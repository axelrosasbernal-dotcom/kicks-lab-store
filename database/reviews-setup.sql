-- ============================================================
-- EJECUTAR EN: Supabase Dashboard → SQL Editor
-- Tabla de reseñas de clientes (sección Testimonios)
-- ============================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Cualquiera puede leer reseñas"
  on public.reviews for select
  using (true);

create policy "Cualquiera puede publicar una reseña"
  on public.reviews for insert
  with check (true);
