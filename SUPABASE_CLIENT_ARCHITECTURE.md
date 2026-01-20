# Arquitectura del Cliente Supabase

## Problema Resuelto

Múltiples instancias de GoTrueClient causaban warnings en el navegador y potenciales problemas de estado compartido.

## Solución Implementada

### 1. Singleton para Cliente del Navegador

**Archivo:** `lib/supabase/client.ts`

\`\`\`typescript
let browserClient: SupabaseClient | undefined

export function createClient() {
  if (browserClient) {
    return browserClient
  }
  
  browserClient = createBrowserClient(...)
  return browserClient
}
\`\`\`

**Beneficios:**
- Una sola instancia de GoTrueClient en todo el navegador
- Estado de autenticación consistente
- Mejor rendimiento (sin crear clientes redundantes)

### 2. Cliente Separado para Server Components

**Archivo:** `lib/supabase/server.ts`

\`\`\`typescript
export async function createServerClient() {
  const cookieStore = await cookies()
  
  return createSupabaseServerClient(..., {
    cookies: { get, set, remove }
  })
}
\`\`\`

**Por qué separado:**
- Server Components necesitan acceso a cookies de Next.js
- Cada request del servidor necesita su propio cliente
- No puede ser singleton (cada request es diferente)

## Guía de Uso

### En Client Components

\`\`\`typescript
"use client"
import { createClient } from "@/lib/supabase/client"

export function MyComponent() {
  const supabase = createClient() // Siempre devuelve la misma instancia
  
  // Usar supabase...
}
\`\`\`

### En Server Components

\`\`\`typescript
import { createServerClient } from "@/lib/supabase/server"

export async function MyServerComponent() {
  const supabase = await createServerClient() // Nueva instancia por request
  
  // Usar supabase...
}
\`\`\`

### En Server Actions

\`\`\`typescript
"use server"
import { createServerClient } from "@/lib/supabase/server"

export async function myAction() {
  const supabase = await createServerClient()
  
  // Usar supabase...
}
\`\`\`

### En Route Handlers (API)

\`\`\`typescript
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createServerClient()
  
  // Usar supabase...
}
\`\`\`

## Reglas Importantes

### ✅ HACER

- Usar `createClient()` en Client Components
- Usar `await createServerClient()` en Server Components
- Llamar `createClient()` dentro de cada componente/función
- Confiar en el singleton del navegador

### ❌ NO HACER

- No crear múltiples singletons
- No usar `createServerClient()` en el cliente
- No usar `createClient()` en el servidor
- No guardar la instancia en variables globales/estado

## Verificación

Para confirmar que solo hay una instancia:

1. Abrir DevTools Console
2. No deberías ver warnings de "Multiple GoTrueClient instances"
3. Auth debería funcionar consistentemente

## Archivos Modificados

- ✅ `lib/supabase/client.ts` - Singleton del navegador
- ✅ `lib/supabase/server.ts` - Cliente del servidor
- ✅ `lib/supabase/database.ts` - Usa singletons correctamente
- ✅ `app/auth/page.tsx` - Usa singleton
- ✅ `app/beta/page.tsx` - Usa singleton

## Testing

\`\`\`typescript
// Test en browser console
const client1 = createClient()
const client2 = createClient()
console.log(client1 === client2) // debe ser true
