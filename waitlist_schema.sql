-- 1. Crear la tabla (si no existe)
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  country text,
  source text,
  role text DEFAULT 'athlete',
  created_at timestamptz DEFAULT now()
);

-- 2. Habilitar Seguridad (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 3. Limpiar políticas antiguas para evitar errores de duplicado
DROP POLICY IF EXISTS "Allow anonymous inserts" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous updates" ON waitlist;
DROP POLICY IF EXISTS "Allow anonymous select" ON waitlist;

-- 4. Nueva Política para permitir INSERTAR
CREATE POLICY "Allow anonymous inserts" ON waitlist FOR INSERT WITH CHECK (true);

-- 5. Nueva Política para permitir ACTUALIZAR (para el paso de nombre/país)
CREATE POLICY "Allow anonymous updates" ON waitlist FOR UPDATE USING (true);

-- 6. Nueva Política para permitir SELECCIONAR (necesaria para recibir el ID tras insertar)
CREATE POLICY "Allow anonymous select" ON waitlist FOR SELECT USING (true);
