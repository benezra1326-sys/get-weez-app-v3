-- Table des établissements Get Weez
CREATE TABLE IF NOT EXISTS establishments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  instagram_url VARCHAR(500),
  website_url VARCHAR(500),
  sponsored BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0.0,
  zone VARCHAR(100),
  ambiance VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_establishments_type ON establishments(type);
CREATE INDEX IF NOT EXISTS idx_establishments_sponsored ON establishments(sponsored);
CREATE INDEX IF NOT EXISTS idx_establishments_zone ON establishments(zone);
CREATE INDEX IF NOT EXISTS idx_establishments_rating ON establishments(rating);

-- RLS (Row Level Security) - Optionnel selon vos besoins
-- ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_establishments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_establishments_updated_at 
    BEFORE UPDATE ON establishments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_establishments_updated_at_column();
