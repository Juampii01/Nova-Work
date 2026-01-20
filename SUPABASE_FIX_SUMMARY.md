# Supabase Client Singleton Fix

## Problem
Multiple GoTrueClient instances were being created because:
1. Client code was executing during SSR (Server-Side Rendering)
2. Each component was creating new instances
3. No true singleton pattern was implemented

## Solution
Implemented a lazy-loading Proxy pattern that:
1. Only creates the client when accessed in the browser
2. Throws an error if accessed on the server
3. Returns the same singleton instance on subsequent accesses
4. Prevents initialization during SSR

## Architecture
- **Browser Client**: `lib/supabase/client.ts` - Single instance via Proxy, browser-only
- **Server Client**: `lib/supabase/server.ts` - Created per-request for server components
- **Middleware**: `middleware.ts` - Creates server client per-request for auth

## Usage
\`\`\`ts
// In Client Components
import { supabase } from "@/lib/supabase/client"

// Access directly - will initialize on first access
const { data } = await supabase.from('table').select()
\`\`\`

## Result
- One GoTrueClient instance in browser
- No client creation during SSR
- No warning in console
- Consistent auth state across app
