-- Gliitz Intelligence Core v7.0 - Schema Supabase
-- Tables nécessaires pour le système d'intelligence artificielle

-- Table des logs de conversations
CREATE TABLE IF NOT EXISTS public.gliitz_conversations_log (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_message TEXT NOT NULL,
    user_emotion TEXT,
    user_intent TEXT,
    ai_response TEXT,
    ai_tone TEXT,
    classification TEXT,
    context JSONB,
    analysis JSONB
);

-- Table des sessions de feedback
CREATE TABLE IF NOT EXISTS public.gliitz_feedback_sessions (
    id TEXT PRIMARY KEY,
    trigger_event TEXT NOT NULL,
    context JSONB,
    prompt JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending'
);

-- Table des feedbacks traités
CREATE TABLE IF NOT EXISTS public.gliitz_feedback_processed (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES public.gliitz_feedback_sessions(id),
    trigger_event TEXT NOT NULL,
    user_response TEXT,
    additional_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis JSONB,
    integration JSONB
);

-- Table de la mémoire centrale (profils utilisateurs)
CREATE TABLE IF NOT EXISTS public.gliitz_memory_core (
    user_id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    language TEXT DEFAULT 'auto',
    preferred_tone TEXT,
    preferred_context JSONB,
    context_weights JSONB,
    location_focus TEXT DEFAULT 'Marbella',
    preferred_zones JSONB,
    zone_weights JSONB,
    last_interactions JSONB,
    interaction_count INTEGER DEFAULT 0,
    style_preferences JSONB,
    content_preferences JSONB,
    feedback_history JSONB,
    average_rating DECIMAL(3,2),
    feedback_patterns JSONB,
    learning_insights JSONB,
    metadata JSONB
);

-- Table des règles d'intégration
CREATE TABLE IF NOT EXISTS public.gliitz_integration_rules (
    id SERIAL PRIMARY KEY,
    feedback_id TEXT,
    priority TEXT,
    actions JSONB,
    learning JSONB,
    adaptation JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS public.gliitz_audit_logs (
    id SERIAL PRIMARY KEY,
    audit_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    results JSONB,
    metrics JSONB,
    recommendations JSONB
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_gliitz_conversations_timestamp ON public.gliitz_conversations_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_gliitz_conversations_classification ON public.gliitz_conversations_log(classification);
CREATE INDEX IF NOT EXISTS idx_gliitz_conversations_emotion ON public.gliitz_conversations_log(user_emotion);

CREATE INDEX IF NOT EXISTS idx_gliitz_feedback_sessions_trigger ON public.gliitz_feedback_sessions(trigger_event);
CREATE INDEX IF NOT EXISTS idx_gliitz_feedback_sessions_status ON public.gliitz_feedback_sessions(status);

CREATE INDEX IF NOT EXISTS idx_gliitz_memory_updated ON public.gliitz_memory_core(last_updated);
CREATE INDEX IF NOT EXISTS idx_gliitz_memory_interaction_count ON public.gliitz_memory_core(interaction_count);

CREATE INDEX IF NOT EXISTS idx_gliitz_audit_logs_type ON public.gliitz_audit_logs(audit_type);
CREATE INDEX IF NOT EXISTS idx_gliitz_audit_logs_timestamp ON public.gliitz_audit_logs(timestamp);

-- Désactiver RLS (Row Level Security) pour permettre l'accès public
ALTER TABLE public.gliitz_conversations_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_feedback_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_feedback_processed DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_memory_core DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_integration_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gliitz_audit_logs DISABLE ROW LEVEL SECURITY;

-- Données d'exemple pour les tests
INSERT INTO public.gliitz_memory_core (
    user_id,
    language,
    preferred_tone,
    preferred_context,
    context_weights,
    location_focus,
    preferred_zones,
    zone_weights,
    style_preferences,
    content_preferences,
    metadata
) VALUES (
    'demo_user',
    'fr',
    'élégant, confiant, chaleureux',
    '["événement", "gastronomie", "voyage", "concierge"]',
    '{"événement": 1.2, "gastronomie": 1.1, "voyage": 1.0, "concierge": 1.0}',
    'Marbella',
    '["Puerto Banús", "Nueva Andalucía", "San Pedro"]',
    '{"Puerto Banús": 1.2, "Nueva Andalucía": 1.1, "San Pedro": 1.0}',
    '{"response_length": "detailed", "detail_level": "high", "emoji_usage": "moderate", "formal_level": "semi_formal"}',
    '{"price_range": "premium", "cuisine_types": ["méditerranéenne", "internationale"], "activity_types": ["luxury", "cultural"]}',
    '{"total_conversations": 0, "engagement_level": "new", "personalization_score": 0.0}'
) ON CONFLICT (user_id) DO NOTHING;

-- Vues utiles pour l'analyse
CREATE OR REPLACE VIEW public.gliitz_conversation_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_conversations,
    COUNT(DISTINCT context->>'userId') as unique_users,
    AVG(CASE WHEN analysis->>'clarity' IS NOT NULL THEN (analysis->>'clarity')::numeric ELSE 0 END) as avg_clarity,
    AVG(CASE WHEN analysis->>'structure' IS NOT NULL THEN (analysis->>'structure')::numeric ELSE 0 END) as avg_structure,
    AVG(CASE WHEN analysis->>'precision' IS NOT NULL THEN (analysis->>'precision')::numeric ELSE 0 END) as avg_precision
FROM public.gliitz_conversations_log
GROUP BY DATE(timestamp)
ORDER BY date DESC;

CREATE OR REPLACE VIEW public.gliitz_emotion_distribution AS
SELECT 
    user_emotion,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM public.gliitz_conversations_log
WHERE user_emotion IS NOT NULL
GROUP BY user_emotion
ORDER BY count DESC;

CREATE OR REPLACE VIEW public.gliitz_user_engagement AS
SELECT 
    user_id,
    COUNT(*) as total_conversations,
    COUNT(DISTINCT DATE(timestamp)) as active_days,
    MAX(timestamp) as last_activity,
    AVG(CASE WHEN analysis->>'clarity' IS NOT NULL THEN (analysis->>'clarity')::numeric ELSE 0 END) as avg_satisfaction
FROM public.gliitz_conversations_log
WHERE context->>'userId' IS NOT NULL
GROUP BY context->>'userId'
ORDER BY total_conversations DESC;

-- Fonctions utiles
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id_param TEXT)
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT to_jsonb(mc.*)
        FROM public.gliitz_memory_core mc
        WHERE mc.user_id = user_id_param
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.get_conversation_history(user_id_param TEXT, limit_count INTEGER DEFAULT 10)
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', id,
                'timestamp', timestamp,
                'user_message', user_message,
                'ai_response', ai_response,
                'classification', classification,
                'emotion', user_emotion
            )
        )
        FROM (
            SELECT *
            FROM public.gliitz_conversations_log
            WHERE context->>'userId' = user_id_param
            ORDER BY timestamp DESC
            LIMIT limit_count
        ) recent_conversations
    );
END;
$$ LANGUAGE plpgsql;

-- Triggers pour la mise à jour automatique
CREATE OR REPLACE FUNCTION public.update_memory_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_memory_last_updated
    BEFORE UPDATE ON public.gliitz_memory_core
    FOR EACH ROW
    EXECUTE FUNCTION public.update_memory_last_updated();

-- Commentaires pour la documentation
COMMENT ON TABLE public.gliitz_conversations_log IS 'Logs de toutes les conversations utilisateur-IA avec analyse';
COMMENT ON TABLE public.gliitz_feedback_sessions IS 'Sessions de feedback utilisateur déclenchées automatiquement';
COMMENT ON TABLE public.gliitz_feedback_processed IS 'Feedbacks utilisateur traités et analysés';
COMMENT ON TABLE public.gliitz_memory_core IS 'Mémoire centrale des profils utilisateurs et préférences';
COMMENT ON TABLE public.gliitz_integration_rules IS 'Règles d''intégration pour l''amélioration automatique';
COMMENT ON TABLE public.gliitz_audit_logs IS 'Logs d''audit et de performance du système';

COMMENT ON VIEW public.gliitz_conversation_stats IS 'Statistiques quotidiennes des conversations';
COMMENT ON VIEW public.gliitz_emotion_distribution IS 'Distribution des émotions détectées';
COMMENT ON VIEW public.gliitz_user_engagement IS 'Métriques d''engagement par utilisateur';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Schema Gliitz Intelligence Core v7.0 créé avec succès!';
    RAISE NOTICE 'Tables créées: gliitz_conversations_log, gliitz_feedback_sessions, gliitz_feedback_processed, gliitz_memory_core, gliitz_integration_rules, gliitz_audit_logs';
    RAISE NOTICE 'Vues créées: gliitz_conversation_stats, gliitz_emotion_distribution, gliitz_user_engagement';
    RAISE NOTICE 'Fonctions créées: get_user_profile, get_conversation_history';
    RAISE NOTICE 'Index et triggers configurés pour optimiser les performances';
END $$;


