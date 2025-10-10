-- Gliitz Intelligence Core v7.2 - Schema Supabase
-- Tables pour système de réservation et compte utilisateur

-- Table des utilisateurs Gliitz
CREATE TABLE IF NOT EXISTS public.gliitz_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    city_preference TEXT DEFAULT 'Marbella',
    budget_preference TEXT DEFAULT 'premium',
    style_preference TEXT DEFAULT 'luxury',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    subscription_tier TEXT DEFAULT 'free',
    metadata JSONB
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS public.gliitz_bookings (
    id SERIAL PRIMARY KEY,
    booking_number TEXT UNIQUE NOT NULL,
    user_id TEXT REFERENCES public.gliitz_users(id),
    type TEXT NOT NULL, -- 'restaurant', 'event', 'service', 'accommodation'
    sub_type TEXT, -- 'yacht', 'villa', 'spa', etc.
    establishment_id INTEGER,
    event_id INTEGER,
    service_id INTEGER,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    guests_count INTEGER DEFAULT 1,
    special_requests TEXT,
    price DECIMAL(10,2),
    location TEXT,
    details JSONB,
    confirmation_sent BOOLEAN DEFAULT false,
    voice_confirmed BOOLEAN DEFAULT false,
    whatsapp_sent BOOLEAN DEFAULT false,
    metadata JSONB
);

-- Table des préférences utilisateur
CREATE TABLE IF NOT EXISTS public.gliitz_user_preferences (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.gliitz_users(id),
    preference_type TEXT NOT NULL, -- 'cuisine', 'activity', 'location', 'budget', 'style'
    preference_value TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_type, preference_value)
);

-- Table des événements utilisateur (événements auxquels l'utilisateur participe)
CREATE TABLE IF NOT EXISTS public.gliitz_user_events (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.gliitz_users(id),
    event_id INTEGER REFERENCES public.events(id),
    booking_id INTEGER REFERENCES public.gliitz_bookings(id),
    status TEXT DEFAULT 'registered', -- 'registered', 'attended', 'cancelled'
    tickets_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Table de feedback post-réservation
CREATE TABLE IF NOT EXISTS public.gliitz_feedback (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES public.gliitz_bookings(id),
    user_id TEXT REFERENCES public.gliitz_users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    experience_type TEXT,
    would_recommend BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Table des notifications utilisateur
CREATE TABLE IF NOT EXISTS public.gliitz_notifications (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.gliitz_users(id),
    type TEXT NOT NULL, -- 'booking_confirmation', 'event_reminder', 'system', 'promotion'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Table des favoris utilisateur
CREATE TABLE IF NOT EXISTS public.gliitz_user_favorites (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.gliitz_users(id),
    item_type TEXT NOT NULL, -- 'establishment', 'event', 'service'
    item_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Table d'activité utilisateur (pour le dashboard)
CREATE TABLE IF NOT EXISTS public.gliitz_user_activity (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.gliitz_users(id),
    activity_type TEXT NOT NULL, -- 'chat', 'booking', 'search', 'view'
    activity_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_gliitz_bookings_user ON public.gliitz_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_gliitz_bookings_status ON public.gliitz_bookings(status);
CREATE INDEX IF NOT EXISTS idx_gliitz_bookings_date ON public.gliitz_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_gliitz_bookings_type ON public.gliitz_bookings(type);

CREATE INDEX IF NOT EXISTS idx_gliitz_preferences_user ON public.gliitz_user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_gliitz_user_events_user ON public.gliitz_user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_gliitz_user_events_event ON public.gliitz_user_events(event_id);

CREATE INDEX IF NOT EXISTS idx_gliitz_feedback_booking ON public.gliitz_feedback(booking_id);
CREATE INDEX IF NOT EXISTS idx_gliitz_feedback_user ON public.gliitz_feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_gliitz_notifications_user ON public.gliitz_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_gliitz_notifications_read ON public.gliitz_notifications(read);

CREATE INDEX IF NOT EXISTS idx_gliitz_favorites_user ON public.gliitz_user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_gliitz_activity_user ON public.gliitz_user_activity(user_id);

-- Désactiver RLS pour permettre l'accès
ALTER TABLE public.gliitz_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_user_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_user_activity DISABLE ROW LEVEL SECURITY;

-- Fonction pour générer un numéro de réservation unique
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        new_number := 'GLT-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        SELECT EXISTS(SELECT 1 FROM public.gliitz_bookings WHERE booking_number = new_number) INTO exists;
        
        EXIT WHEN NOT exists;
    END LOOP;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le numéro de réservation
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
        NEW.booking_number := generate_booking_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_number
    BEFORE INSERT ON public.gliitz_bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_number();

-- Fonction pour obtenir le dashboard utilisateur
CREATE OR REPLACE FUNCTION get_user_dashboard(user_id_param TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'user', (SELECT to_jsonb(u.*) FROM public.gliitz_users u WHERE u.id = user_id_param),
        'bookings_count', (SELECT COUNT(*) FROM public.gliitz_bookings WHERE user_id = user_id_param),
        'recent_bookings', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'booking_number', booking_number,
                    'type', type,
                    'status', status,
                    'booking_date', booking_date,
                    'location', location
                )
            )
            FROM (
                SELECT * FROM public.gliitz_bookings
                WHERE user_id = user_id_param
                ORDER BY created_at DESC
                LIMIT 5
            ) recent
        ),
        'upcoming_events', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'event_id', ue.event_id,
                    'status', ue.status,
                    'tickets_count', ue.tickets_count
                )
            )
            FROM public.gliitz_user_events ue
            WHERE ue.user_id = user_id_param
            AND ue.status = 'registered'
        ),
        'preferences', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'type', preference_type,
                    'value', preference_value,
                    'priority', priority
                )
            )
            FROM public.gliitz_user_preferences
            WHERE user_id = user_id_param
            ORDER BY priority DESC
        ),
        'unread_notifications', (
            SELECT COUNT(*) FROM public.gliitz_notifications
            WHERE user_id = user_id_param AND read = false
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer une réservation
CREATE OR REPLACE FUNCTION create_booking(
    p_user_id TEXT,
    p_type TEXT,
    p_booking_date TIMESTAMP WITH TIME ZONE,
    p_location TEXT,
    p_details JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB AS $$
DECLARE
    new_booking_id INTEGER;
    new_booking_number TEXT;
BEGIN
    INSERT INTO public.gliitz_bookings (
        user_id,
        type,
        booking_date,
        location,
        status,
        details,
        created_at
    ) VALUES (
        p_user_id,
        p_type,
        p_booking_date,
        p_location,
        'confirmed',
        p_details,
        NOW()
    )
    RETURNING id, booking_number INTO new_booking_id, new_booking_number;
    
    -- Créer une notification
    INSERT INTO public.gliitz_notifications (
        user_id,
        type,
        title,
        message,
        created_at
    ) VALUES (
        p_user_id,
        'booking_confirmation',
        'Réservation confirmée',
        'Votre réservation ' || new_booking_number || ' a été confirmée avec succès.',
        NOW()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'booking_id', new_booking_id,
        'booking_number', new_booking_number,
        'message', 'Réservation créée avec succès'
    );
END;
$$ LANGUAGE plpgsql;

-- Vues utiles pour le dashboard
CREATE OR REPLACE VIEW public.gliitz_user_stats AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END) as confirmed_bookings,
    COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as completed_bookings,
    COUNT(DISTINCT ue.id) as total_events,
    COUNT(DISTINCT f.id) as total_feedback,
    AVG(f.rating) as average_rating,
    MAX(b.created_at) as last_booking_date
FROM public.gliitz_users u
LEFT JOIN public.gliitz_bookings b ON u.id = b.user_id
LEFT JOIN public.gliitz_user_events ue ON u.id = ue.user_id
LEFT JOIN public.gliitz_feedback f ON u.id = f.user_id
GROUP BY u.id, u.full_name, u.email;

CREATE OR REPLACE VIEW public.gliitz_booking_summary AS
SELECT 
    DATE(created_at) as booking_date,
    type,
    status,
    COUNT(*) as count,
    SUM(price) as total_revenue
FROM public.gliitz_bookings
GROUP BY DATE(created_at), type, status
ORDER BY booking_date DESC;

-- Données de test
INSERT INTO public.gliitz_users (id, email, full_name, phone, city_preference, budget_preference, style_preference)
VALUES 
    ('user_test_001', 'test@gliitz.com', 'Utilisateur Test', '+33612345678', 'Marbella', 'premium', 'luxury'),
    ('user_demo_001', 'demo@gliitz.com', 'Demo Gliitz', '+33687654321', 'Marbella', 'premium', 'elegant')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;

-- Préférences de test
INSERT INTO public.gliitz_user_preferences (user_id, preference_type, preference_value, priority)
VALUES 
    ('user_test_001', 'cuisine', 'japonaise', 3),
    ('user_test_001', 'cuisine', 'méditerranéenne', 2),
    ('user_test_001', 'activity', 'luxury', 3),
    ('user_test_001', 'location', 'Puerto Banús', 2),
    ('user_test_001', 'budget', 'premium', 1)
ON CONFLICT (user_id, preference_type, preference_value) DO NOTHING;

-- Réservations de test
INSERT INTO public.gliitz_bookings (user_id, type, sub_type, booking_date, location, status, guests_count, price, details)
VALUES 
    ('user_test_001', 'restaurant', 'japonais', NOW() + INTERVAL '1 day', 'Marbella', 'confirmed', 2, 150.00, '{"cuisine": "japonaise", "time": "20:00"}'),
    ('user_test_001', 'service', 'yacht', NOW() + INTERVAL '3 days', 'Puerto Banús', 'confirmed', 6, 2500.00, '{"duration": "4 hours", "type": "private"}'),
    ('user_test_001', 'event', 'concert', NOW() + INTERVAL '7 days', 'Marbella', 'pending', 2, 180.00, '{"event_type": "music", "artist": "DJ International"}')
ON CONFLICT DO NOTHING;

-- Commentaires pour la documentation
COMMENT ON TABLE public.gliitz_users IS 'Utilisateurs Gliitz avec préférences et profil';
COMMENT ON TABLE public.gliitz_bookings IS 'Réservations effectuées via Gliitz (restaurants, événements, services)';
COMMENT ON TABLE public.gliitz_user_preferences IS 'Préférences détaillées de chaque utilisateur';
COMMENT ON TABLE public.gliitz_user_events IS 'Événements auxquels les utilisateurs participent';
COMMENT ON TABLE public.gliitz_feedback IS 'Feedback post-réservation des utilisateurs';

COMMENT ON FUNCTION generate_booking_number() IS 'Génère un numéro de réservation unique au format GLT-XXXX';
COMMENT ON FUNCTION get_user_dashboard(TEXT) IS 'Retourne toutes les données du dashboard utilisateur';
COMMENT ON FUNCTION create_booking IS 'Crée une nouvelle réservation avec notification automatique';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Schema Gliitz v7.2 créé avec succès!';
    RAISE NOTICE '📊 Tables créées: users, bookings, preferences, events, feedback, notifications, favorites, activity';
    RAISE NOTICE '🔧 Fonctions créées: generate_booking_number, get_user_dashboard, create_booking';
    RAISE NOTICE '📈 Vues créées: user_stats, booking_summary';
    RAISE NOTICE '🎯 Données de test insérées pour user_test_001';
END $$;

