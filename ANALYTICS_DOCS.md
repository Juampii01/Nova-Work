# Analytics & Gráficos - Documentación

## ✅ Implementación Completada

Se ha implementado un dashboard de analytics con gráficos interactivos usando **Recharts** para visualizar métricas clave del negocio.

## Componentes Implementados

### 1. **components/analytics-view.tsx** (NEW)
Componente que muestra todos los gráficos y métricas

**Gráficos incluidos:**
- 📈 **Línea:** Aplicaciones por día (últimos 30 días)
- 📊 **Barras:** Aplicaciones por categoría de trabajo
- 🥧 **Pie:** Estado de aplicaciones (Pendientes, Vistos, Aceptados, Rechazados)
- 📋 **Cards:** Resumen por estado con colores diferenciados

**Features:**
- ✓ Responsive (mobile, tablet, desktop)
- ✓ Colores semánticos (éxito=verde, alerta=amarillo, rechazo=rojo)
- ✓ Tooltips interactivos en hover
- ✓ Labels directos en gráficos
- ✓ KPIs destacados (total, pendientes, aceptados, tasa contratación)
- ✓ Cards informativos con estado

### 2. **lib/supabase/database.ts** (UPDATED)
Funciones agregadas para obtener datos de analytics:

```typescript
// Obtiene aplicaciones agrupadas por fecha (últimos 30 días)
getJobsViewsOverTime(userId, days = 30)

// Obtiene aplicaciones agrupadas por categoría de trabajo
getApplicationsByCategory(userId)

// Obtiene desglose de aplicaciones por estado
getApplicationStatusBreakdown(userId)
```

### 3. **app/dashboard/page.tsx** (UPDATED)
Integración de analytics en nueva tab "Analytics"

**Cambios:**
- ✅ Nueva tab "Analytics" en el dashboard
- ✅ Estado `analyticsData` para guardar datos
- ✅ Carga de datos en `useEffect` inicial
- ✅ Loading states mientras se cargan gráficos
- ✅ Icono de gráfico en tab

## Visualizaciones

### 1. Line Chart - Aplicaciones por Día
```
Eje X: Fechas (últimos 30 días)
Eje Y: Número de aplicaciones
Línea: Evolución diaria de aplicaciones
```

**Insight:** Identifica tendencias de aplicaciones a lo largo del mes. Picos indican días con mayor actividad.

### 2. Bar Chart - Aplicaciones por Categoría
```
Eje X: Número de aplicaciones
Eje Y: Categorías de trabajos
Barras: Cantidad de aplicaciones por categoría
```

**Insight:** Ve qué tipos de trabajos reciben más aplicaciones. Útil para priorizar.

### 3. Pie Chart - Estado de Aplicaciones
```
Segmentos: 
  - Amarillo (Pendientes) - Sin revisar
  - Cyan (Vistos) - En análisis
  - Verde (Aceptados) - Seleccionados
  - Rojo (Rechazados) - Descartados
```

**Insight:** Distribución del pipeline de contratación. Ver dónde se concentra el flujo.

### 4. KPIs & Cards
```
Total Aplicaciones: Suma de todas las aplicaciones
Pendientes: Aplicaciones sin revisar
Aceptados: Candidatos seleccionados
Tasa de Contratación: (Aceptados / Total) * 100
```

## Datos Utilizados

**Tablas consultadas:**
- `jobs` - Para obtener categoría
- `applications` - Para estado, fecha, relación con jobs
- `profiles` - Para información del recruiter

**Filtros aplicados:**
- Solo datos de la empresa del recruiter (company_id)
- Últimos 30 días de aplicaciones
- Agrupado por estado, categoría y fecha

## Flujo de Carga

```
1. Usuario abre dashboard
2. En useEffect, se cargan:
   - getJobsViewsOverTime() → array de {date, applications}
   - getApplicationsByCategory() → array de {category, applications}
   - getApplicationStatusBreakdown() → {pending, viewed, accepted, rejected}
3. Datos se guardan en state `analyticsData`
4. AnalyticsView renderiza todos los gráficos
```

## Colores Semánticos

| Métrica | Color | Significado |
|---------|-------|-------------|
| Primary | Azul | Gráficos principales |
| Success | Verde | Aceptados / Positivo |
| Warning | Amarillo | Pendientes / Atención |
| Danger | Rojo | Rechazados / Negativo |
| Accent | Cyan | Vistos / Neutro |
| Secondary | Púrpura | Categorías |

## Responsive Design

- **Mobile:** Stack vertical, gráficos aprilan ancho completo
- **Tablet:** 2 columnas para gráficos
- **Desktop:** 2 columnas + sidebar con información

## Performance

- **Rendering:** Recharts optimizado para ~1000+ puntos de datos
- **Caching:** Datos se cargan una sola vez al abrir dashboard
- **Tooltips:** Lazy-rendered al hover
- **Responsividad:** Container responsive redibuja al resize

## Validación

✅ **Build:** `✓ Compiled successfully` (0 errores)
✅ **Recharts:** Instalado y funcionando
✅ **Integración:** Nueva tab en dashboard
✅ **Datos:** Funciones de database retornan datos correctos
✅ **UX:** Gráficos responsivos y legibles

## Ejemplos de Insight

### Escenario 1: Recruiter nuevo
- Gráficos sin datos o con datos mínimos
- Útil para establecer baseline
- KPI de tasa de contratación = 0% (normal)

### Escenario 2: Recruiter activo
- Line chart muestra picos en días laborales
- Bar chart muestra categorías populares
- Pie chart muestra distribución equilibrada
- KPI de tasa de contratación > 30% = bueno

### Escenario 3: Problema detectado
- Aplicaciones pendientes acumuladas
- Bar chart desbalanceada (categoría domina)
- Pie chart con muchos rechazados
- Acción: Revisar proceso de screening

## Próximas Mejoras (Roadmap)

**Phase 1 - Estadísticas Avanzadas:**
1. Filtro por rango de fechas personalizado
2. Métricas de velocidad de contratación (days-to-hire)
3. Tasa de conversion (aplicaciones → entrevista → oferta)

**Phase 2 - Predicciones:**
1. ML para predecir best fit por categoría
2. Forecasting de aplicaciones futuras
3. Alertas si caen aplicaciones

**Phase 3 - Integración:**
1. Export a PDF/Excel
2. Share reports con equipo
3. Webhooks para notificaciones de hitos
4. API pública para BI tools

**Phase 4 - Gamificación:**
1. Benchmarks con otros recruiters
2. Badges por tasa de contratación
3. Leaderboard de categorías

## Testing

Para validar los analytics:

```bash
# 1. Acceder a dashboard
http://localhost:3001/dashboard

# 2. Click en tab "Analytics" (icono de gráfico)

# 3. Validar:
- Line chart con aplicaciones últimos 30 días
- Bar chart con categorías
- Pie chart con estados
- Cards con KPIs
- Datos corresponden a las aplicaciones reales

# 4. Responsivo:
- Abrir en mobile (DevTools)
- Gráficos deben redimensionarse
- No debe haber overflow

# 5. Performance:
- Scroll: Debe ser smooth
- Hover en gráficos: Tooltips aparecen rápido
- No debería haber lags
```

## SQL Schema (Para referencia)

```sql
-- Si se quisiera agregar tracking de views
ALTER TABLE jobs ADD COLUMN views_count INT DEFAULT 0;
ALTER TABLE jobs ADD COLUMN last_viewed_at TIMESTAMP;

-- Trigger para actualizar views
CREATE OR REPLACE FUNCTION increment_job_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE jobs SET views_count = views_count + 1 WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Estado: ✅ COMPLETADO

- **Build:** ✓ Compiled successfully
- **Funcionalidad:** 3 gráficos + 1 pie chart + KPIs
- **Performance:** Optimizado con Recharts
- **UX:** Responsivo y intuitivo
- **Producción-Ready:** Sí ✓

---

**Hecho con ❤️ | Tiempo: ~50 min**
