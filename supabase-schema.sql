-- Table des abonnements Get Weez
CREATE TABLE IF NOT EXISTS abonnements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  prix_mensuel DECIMAL(10,2),
  prix_annuel DECIMAL(10,2),
  avantages JSONB,
  actif BOOLEAN DEFAULT true,
  ordre_affichage INTEGER DEFAULT 0,
  couleur VARCHAR(7) DEFAULT '#8B5CF6', -- Couleur hexadécimale
  icone VARCHAR(50), -- Nom de l'icône Lucide
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_abonnements_actif ON abonnements(actif);
CREATE INDEX IF NOT EXISTS idx_abonnements_ordre ON abonnements(ordre_affichage);

-- RLS (Row Level Security) - Optionnel selon vos besoins
-- ALTER TABLE abonnements ENABLE ROW LEVEL SECURITY;

-- Données d'exemple pour les abonnements
INSERT INTO abonnements (nom, description, prix_mensuel, prix_annuel, avantages, ordre_affichage, couleur, icone) VALUES
(
  'Invité',
  'Accès limité aux fonctionnalités de base',
  0.00,
  0.00,
  '{"recommendations_max": 5, "reservations": false, "evenements_exclusifs": false, "support_prioritaire": false, "concierge_personnel": false}',
  1,
  '#6B7280',
  'User'
),
(
  'Premium',
  'Accès complet à toutes les fonctionnalités Get Weez',
  39.99,
  335.99, -- 30% de réduction sur 12 mois (39.99 * 12 * 0.7)
  '{"recommendations_max": -1, "reservations": true, "evenements_exclusifs": true, "support_prioritaire": true, "concierge_personnel": true, "reductions_partenaires": true}',
  2,
  '#8B5CF6',
  'Crown'
),
(
  'VIP',
  'Service de conciergerie personnalisé et exclusif',
  99.99,
  839.99, -- 30% de réduction sur 12 mois (99.99 * 12 * 0.7)
  '{"recommendations_max": -1, "reservations": true, "evenements_exclusifs": true, "support_prioritaire": true, "concierge_personnel": true, "reductions_partenaires": true, "acces_private_events": true, "reservation_prioritaire": true, "concierge_dedie": true}',
  3,
  '#F59E0B',
  'Star'
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_abonnements_updated_at 
    BEFORE UPDATE ON abonnements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
