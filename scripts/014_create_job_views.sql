-- Tabla para registrar vistas de jobs
CREATE TABLE IF NOT EXISTS job_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id, session_id, viewed_at)
);

-- Index para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_job_views_job_id ON job_views(job_id);
CREATE INDEX IF NOT EXISTS idx_job_views_user_id ON job_views(user_id);