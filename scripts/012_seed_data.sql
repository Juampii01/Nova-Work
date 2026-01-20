-- Seed data for testing Nova Work
-- Using correct constraint values

-- Insert sample companies with correct size values and slug field
INSERT INTO public.companies (name, slug, description, industry, size, location_text, website, is_verified) 
SELECT 'TechStart Buenos Aires', 'techstart-buenos-aires', 'Startup de tecnología innovadora', 'Tecnología', '11-50', 'Palermo, CABA', 'https://techstart.com', true
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE slug = 'techstart-buenos-aires');

INSERT INTO public.companies (name, slug, description, industry, size, location_text, website, is_verified) 
SELECT 'Mueblería San Telmo', 'muebleria-san-telmo', 'Fabricación de muebles a medida', 'Manufactura', '11-50', 'San Telmo, CABA', 'https://muebleriastelmo.com', true
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE slug = 'muebleria-san-telmo');

INSERT INTO public.companies (name, slug, description, industry, size, location_text, website, is_verified) 
SELECT 'Marketing Digital Pro', 'marketing-digital-pro', 'Agencia de marketing digital', 'Marketing', '51-200', 'Recoleta, CABA', 'https://marketingpro.com', false
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE slug = 'marketing-digital-pro');

-- Insert sample jobs with correct column names and constraint values
-- Updated status values from 'activo' to 'active' to match constraint
-- modality: 'presencial', 'híbrido', 'remoto' (with accent on híbrido)
-- job_type: 'tiempo_completo', 'medio_tiempo', 'freelance', 'pasantia'
-- status: 'active', 'closed', 'draft' (in English as per constraint)

INSERT INTO public.jobs (company_id, title, description, category, modality, job_type, location_text, salary_min, salary_max, salary_currency, show_salary, requirements, status) 
SELECT c.id, 'Desarrollador Frontend React', 'Buscamos desarrollador frontend con experiencia en React y TypeScript para trabajar en proyectos innovadores.', 'desarrollo', 'híbrido', 'tiempo_completo', 'Palermo, CABA', 150000, 200000, 'ARS', true, ARRAY['React', 'TypeScript', 'Next.js', '2+ años de experiencia'], 'active'
FROM public.companies c WHERE c.slug = 'techstart-buenos-aires' LIMIT 1;

INSERT INTO public.jobs (company_id, title, description, category, modality, job_type, location_text, salary_min, salary_max, salary_currency, show_salary, requirements, status) 
SELECT c.id, 'Carpintero Experimentado', 'Necesitamos carpintero con experiencia en muebles a medida y restauración.', 'construccion', 'presencial', 'tiempo_completo', 'San Telmo, CABA', 120000, 150000, 'ARS', true, ARRAY['5+ años experiencia', 'Herramientas propias', 'Portfolio de trabajos'], 'active'
FROM public.companies c WHERE c.slug = 'muebleria-san-telmo' LIMIT 1;

INSERT INTO public.jobs (company_id, title, description, category, modality, job_type, location_text, salary_min, salary_max, salary_currency, show_salary, requirements, status) 
SELECT c.id, 'Community Manager', 'Buscamos CM creativo para gestionar redes sociales de clientes importantes.', 'marketing', 'remoto', 'medio_tiempo', 'Recoleta, CABA', 80000, 100000, 'ARS', true, ARRAY['Experiencia en redes sociales', 'Diseño gráfico básico', 'Copywriting'], 'active'
FROM public.companies c WHERE c.slug = 'marketing-digital-pro' LIMIT 1;

-- Note: User profiles are created automatically via trigger when users register
-- No need to seed profiles manually
