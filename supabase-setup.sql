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
