-- Eliminar el trigger que rompe el signup en Supabase
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- (Opcional) Eliminar la función si no se usa en otro lado
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Ahora el perfil se debe crear desde el frontend, después del signup, usando el usuario autenticado.
-- Ejemplo de inserción segura en profiles:
--
-- await supabase.from('profiles').insert({
--   id: user.id,
--   email: user.email,
--   ...otrosCampos
-- })
--
-- Esto cumple la política RLS y no rompe el flujo de signup.
