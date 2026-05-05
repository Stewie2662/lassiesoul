-- ============================================================
-- OPCION A: Empezar limpio (ejecutar esto si quieres resetear)
-- ADVERTENCIA: borra todos los datos existentes
-- ============================================================
-- Descomenta estas líneas si quieres borrar todo y empezar:
-- DROP TABLE IF EXISTS animals CASCADE;
-- DROP TABLE IF EXISTS shelters CASCADE;
-- DROP TABLE IF EXISTS user_roles CASCADE;


-- ============================================================
-- OPCION B: Crear solo lo que no existe (seguro, sin perder datos)
-- ============================================================

-- Tabla user_roles (nueva, probablemente no existe)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'shelter', 'adopter')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla shelters (ya existe, añadir columnas faltantes si las hay)
CREATE TABLE IF NOT EXISTS shelters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Añadir columnas a shelters si no existen
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS slug VARCHAR(100);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Tabla animals (ya puede existir)
CREATE TABLE IF NOT EXISTS animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shelter_id UUID NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  age_years INTEGER,
  size VARCHAR(20),
  gender VARCHAR(20),
  description TEXT,
  photo_url TEXT,
  is_vaccinated BOOLEAN DEFAULT FALSE,
  is_sterilized BOOLEAN DEFAULT FALSE,
  is_compatible_kids BOOLEAN,
  is_compatible_animals BOOLEAN,
  status VARCHAR(20) DEFAULT 'available',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Añadir columnas a animals si no existen
ALTER TABLE animals ADD COLUMN IF NOT EXISTS is_vaccinated BOOLEAN DEFAULT FALSE;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS is_sterilized BOOLEAN DEFAULT FALSE;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS is_compatible_kids BOOLEAN;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS is_compatible_animals BOOLEAN;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'available';

-- ============================================================
-- RLS: activar en todas las tablas
-- ============================================================
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Policies: borrar si ya existen antes de crearlas
-- ============================================================
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
CREATE POLICY "Users can read their own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shelters can read their own profile" ON shelters;
CREATE POLICY "Shelters can read their own profile"
  ON shelters FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shelters can update their own profile" ON shelters;
CREATE POLICY "Shelters can update their own profile"
  ON shelters FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shelters can insert their own profile" ON shelters;
CREATE POLICY "Shelters can insert their own profile"
  ON shelters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shelters can manage their own animals" ON animals;
CREATE POLICY "Shelters can manage their own animals"
  ON animals FOR ALL
  USING (auth.uid() = (SELECT user_id FROM shelters WHERE id = shelter_id));

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_shelters_user_id ON shelters(user_id);
CREATE INDEX IF NOT EXISTS idx_shelters_slug ON shelters(slug);
CREATE INDEX IF NOT EXISTS idx_animals_shelter_id ON animals(shelter_id);
