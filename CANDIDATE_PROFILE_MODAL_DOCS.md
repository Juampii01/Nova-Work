# Modal de Perfil de Candidato - Documentación

## ✅ Implementación Completada

Se ha implementado un modal completo que permite a los recruiters ver el perfil detallado de los candidatos que aplicaron a sus ofertas de trabajo.

## Componentes Creados/Modificados

### 1. **components/candidate-profile-modal.tsx** (NEW)
- Modal interactivo que muestra el perfil completo del candidato
- **Propiedades mostradas:**
  - Avatar o inicial del nombre
  - Nombre completo y profesión
  - Ubicación y calificación promedio
  - Bio/descripción
  - Skills (con nivel de experiencia)
  - Experiencia laboral (con fechas)
  - Certificaciones
  - Email de contacto

- **Características:**
  - Estado de carga mientras se obtiene el perfil
  - Botón "Contactar" (placeholder para sistema de mensajería)
  - Responsive y elegante
  - Diseño limpio con iconos (Lucide)

### 2. **lib/supabase/database.ts** (UPDATED)
- **Función agregada:** `getCandidateProfile(userId: string)`
- Obtiene automáticamente:
  - Perfil base del usuario
  - Skills con nivel
  - Experiencia laboral
  - Certificaciones
  - Promedio de ratings/reviews
  - Total de reseñas

### 3. **app/dashboard/page.tsx** (UPDATED)
- Integración del modal en la sección de "Candidatos"
- Al hacer click en un candidato:
  1. Se abre el modal
  2. Se carga el perfil completo
  3. Se muestra toda la información
- **Estados añadidos:**
  - `selectedCandidate` - Perfil actual
  - `candidateModalOpen` - Control del modal
  - `loadingCandidateProfile` - Estado de carga
- **Función:** `handleOpenCandidateProfile(candidateUserId)`

## Flujo de Uso

1. **Recruiter accede al dashboard**
   - Va a la sección "Candidatos"

2. **Selecciona un job** 
   - Los candidatos se cargan automáticamente
   - Pueden filtrar por estado (Pendientes, Vistos, Aceptados, Rechazados)

3. **Hace click en un candidato**
   - Modal se abre
   - Se carga el perfil en background
   - Se muestra:
     - Información personal
     - Skills y experiencia
     - Certificaciones
     - Botón para contactar

4. **Puede ver más detalles**
   - Experiencia laboral con descripciones
   - Calificaciones de reviews anteriores
   - Skills ordenadas por nivel

## Tablas de Base de Datos Utilizadas

```sql
-- Datos del candidato
profiles (id, full_name, avatar_url, bio, profession, location_text, email)

-- Skills del candidato
candidate_skills (id, user_id, name, level)

-- Experiencia laboral
candidate_experience (
  id, 
  user_id, 
  title, 
  company, 
  location,
  start_date,
  end_date,
  is_current,
  description
)

-- Certificaciones
candidate_certifications (
  id,
  user_id,
  name,
  issuer,
  issue_date
)

-- Reviews/Ratings
reviews (id, reviewed_user_id, rating)
```

## Validación

✅ **Build Compilation:** `✓ Compiled successfully`
✅ **Imports:** Todos los componentes UI existen
✅ **Integración:** Modal renderiza en dashboard
✅ **UX:** Click en candidato → Modal con perfil

## Próximos Pasos

1. **Sistema de Mensajería** - Botón "Contactar" 
   - Implementar chat en tiempo real
   - Notificaciones de nuevos mensajes

2. **Analytics Avanzado** - Dashboard de recruiter
   - Gráficas de aplicaciones
   - Estadísticas de contratación

3. **Exportar Candidatos** - Descarga de perfiles
   - PDF del perfil
   - CSV con datos de candidatos

## Testing

Para probar el modal:

1. Acceder a `http://localhost:3001/dashboard` como recruiter
2. Publicar una job (si no hay)
3. Aplicar a la job como candidato (otro usuario)
4. En dashboard, ir a "Candidatos"
5. **Hacer click en el candidato** → Modal se abre
6. Ver perfil completo con todos los detalles

---

**Estado:** ✅ COMPLETADO Y VERIFICADO
**Tiempo estimado:** 40 min (entregado en tiempo)
**Próxima tarea:** Sistema de Mensajería
