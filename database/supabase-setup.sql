-- ============================================================
-- EJECUTAR EN: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Tabla de perfiles con roles
CREATE TABLE IF NOT EXISTS public.profiles (
  id   UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden leer su propio perfil
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios ven su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- ============================================================
-- 2. Función auxiliar: asigna rol al crear usuario
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (
    NEW.id,
    CASE
      WHEN NEW.email = 'axelrosasbernal@gmail.com' THEN 'admin'
      ELSE 'client'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Disparador: se ejecuta al insertar en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. Función: comprueba si el usuario autenticado es admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- 4. RLS en la tabla products
-- ============================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver los productos (tienda pública)
DROP POLICY IF EXISTS "Todos pueden ver productos" ON public.products;
CREATE POLICY "Todos pueden ver productos"
  ON public.products FOR SELECT
  USING (true);

-- Solo admins pueden insertar
DROP POLICY IF EXISTS "Solo admin inserta productos" ON public.products;
CREATE POLICY "Solo admin inserta productos"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

-- Solo admins pueden actualizar
DROP POLICY IF EXISTS "Solo admin actualiza productos" ON public.products;
CREATE POLICY "Solo admin actualiza productos"
  ON public.products FOR UPDATE
  USING (public.is_admin());

-- Solo admins pueden eliminar
DROP POLICY IF EXISTS "Solo admin elimina productos" ON public.products;
CREATE POLICY "Solo admin elimina productos"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 5. Insertar perfil admin si ya existe el usuario
--    (para cuentas creadas antes de este script)
-- ============================================================
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'axelrosasbernal@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ============================================================
-- 6. Tabla de favoritos (clicks de corazón de los clientes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver favoritos (datos no sensibles: solo product_id + sesión anónima)
DROP POLICY IF EXISTS "Todos pueden ver favoritos" ON public.favorites;
CREATE POLICY "Todos pueden ver favoritos"
  ON public.favorites FOR SELECT
  USING (true);

-- Cualquiera puede agregar un favorito
DROP POLICY IF EXISTS "Cualquiera puede agregar favoritos" ON public.favorites;
CREATE POLICY "Cualquiera puede agregar favoritos"
  ON public.favorites FOR INSERT
  WITH CHECK (true);

-- Cualquiera puede borrar favoritos (el cliente controla por product_id + session_id)
DROP POLICY IF EXISTS "Cualquiera puede borrar favoritos" ON public.favorites;
CREATE POLICY "Cualquiera puede borrar favoritos"
  ON public.favorites FOR DELETE
  USING (true);

-- ============================================================
-- 7bis. Tabla orders + RLS (pedidos: nombre y teléfono del cliente)
--       La tabla nunca se creó (OrdersPanel.jsx atrapaba el error y
--       mostraba la lista vacía en silencio). Solo se usa desde el
--       panel de admin, nunca desde el checkout público, así que
--       queda 100% admin-only.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  product_name   TEXT NOT NULL,
  brand          TEXT,
  size           TEXT,
  price          NUMERIC,
  quantity       INTEGER DEFAULT 1,
  total_price    NUMERIC,
  status         TEXT NOT NULL DEFAULT 'Pendiente'
                 CHECK (status IN ('Pendiente', 'En proceso', 'Entregado', 'Cancelado')),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Solo admin ve pedidos" ON public.orders;
CREATE POLICY "Solo admin ve pedidos"
  ON public.orders FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Solo admin crea pedidos" ON public.orders;
CREATE POLICY "Solo admin crea pedidos"
  ON public.orders FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Solo admin actualiza pedidos" ON public.orders;
CREATE POLICY "Solo admin actualiza pedidos"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Solo admin elimina pedidos" ON public.orders;
CREATE POLICY "Solo admin elimina pedidos"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ============================================================
-- 7ter. Endurecer favorites: validar product_id contra products
--       y exigir session_id no vacío en insert.
--       Nota: no hay auth real de por medio (sesión anónima por
--       localStorage), así que esto no impide que alguien mande
--       un session_id ajeno a propósito; sí evita el caso más común
--       de bots/spam sin session_id y de product_id inventados.
--       Una defensa completa requeriría Supabase Auth anónimo.
-- ============================================================
-- Limpia favoritos huérfanos (product_id que ya no existe en products)
-- antes de poder agregar la FK.
DELETE FROM public.favorites f
WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.id = f.product_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'favorites_product_id_fkey'
  ) THEN
    ALTER TABLE public.favorites
      ADD CONSTRAINT favorites_product_id_fkey
      FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
  END IF;
END $$;

DROP POLICY IF EXISTS "Cualquiera puede agregar favoritos" ON public.favorites;
CREATE POLICY "Cualquiera puede agregar favoritos"
  ON public.favorites FOR INSERT
  WITH CHECK (session_id IS NOT NULL AND session_id <> '');

DROP POLICY IF EXISTS "Cualquiera puede borrar favoritos" ON public.favorites;
CREATE POLICY "Cualquiera puede borrar favoritos"
  ON public.favorites FOR DELETE
  USING (session_id IS NOT NULL);

-- ============================================================
-- 8. Políticas de Storage para el bucket AXELRB (fotos de productos)
-- ============================================================

-- Cualquiera puede ver las imágenes (bucket público, tienda visible sin login)
DROP POLICY IF EXISTS "Todos pueden ver imágenes de AXELRB" ON storage.objects;
CREATE POLICY "Todos pueden ver imágenes de AXELRB"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'AXELRB');

-- Solo admins pueden subir imágenes
DROP POLICY IF EXISTS "Solo admin sube imágenes a AXELRB" ON storage.objects;
CREATE POLICY "Solo admin sube imágenes a AXELRB"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'AXELRB' AND public.is_admin());

-- Solo admins pueden reemplazar/actualizar imágenes
DROP POLICY IF EXISTS "Solo admin actualiza imágenes en AXELRB" ON storage.objects;
CREATE POLICY "Solo admin actualiza imágenes en AXELRB"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'AXELRB' AND public.is_admin());

-- Solo admins pueden borrar imágenes
DROP POLICY IF EXISTS "Solo admin borra imágenes en AXELRB" ON storage.objects;
CREATE POLICY "Solo admin borra imágenes en AXELRB"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'AXELRB' AND public.is_admin());

-- ============================================================
-- 9. Políticas de Storage para el bucket PEDIDOS (fotos de "Pedí lo que buscás")
-- ============================================================
-- El bucket "PEDIDOS" hay que crearlo a mano en el dashboard de Supabase
-- (Storage → New bucket → nombre "PEDIDOS" → marcarlo como Public).
-- Cualquiera puede subir (formulario público sin login) y ver (para que
-- el link llegue navegable por WhatsApp). Nadie puede listar el bucket
-- completo porque el nombre de archivo incluye un id random.

DROP POLICY IF EXISTS "Cualquiera puede subir fotos de pedidos" ON storage.objects;
CREATE POLICY "Cualquiera puede subir fotos de pedidos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'PEDIDOS');

DROP POLICY IF EXISTS "Cualquiera puede ver fotos de pedidos" ON storage.objects;
CREATE POLICY "Cualquiera puede ver fotos de pedidos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'PEDIDOS');
