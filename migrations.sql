-- Migration: Create user_roles table
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'shelter', 'adopter')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Create shelters table
CREATE TABLE shelters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Create animals table
CREATE TABLE animals (
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

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- RLS Policy: user_roles - Users can read their own role
CREATE POLICY "Users can read their own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: shelters - Shelters can read their own profile
CREATE POLICY "Shelters can read their own profile"
  ON shelters FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: shelters - Shelters can update their own profile
CREATE POLICY "Shelters can update their own profile"
  ON shelters FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: shelters - Shelters can insert their own profile (on signup)
CREATE POLICY "Shelters can insert their own profile"
  ON shelters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: animals - Shelters can read/edit/delete their own animals
CREATE POLICY "Shelters can manage their own animals"
  ON animals FOR ALL
  USING (auth.uid() = (SELECT user_id FROM shelters WHERE id = shelter_id));

-- Indexes for performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_shelters_user_id ON shelters(user_id);
CREATE INDEX idx_shelters_slug ON shelters(slug);
CREATE INDEX idx_animals_shelter_id ON animals(shelter_id);
