-- Agregar campo 'role' a profiles si no existe
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'candidate';

-- Opciones válidas: 'candidate', 'recruiter', 'admin'
-- Para actualizar roles existentes:
-- UPDATE profiles SET role = 'candidate' WHERE role IS NULL;