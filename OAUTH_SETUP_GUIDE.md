# 🔐 Guía de Configuración OAuth para Nova Work

Esta guía te ayudará a configurar la autenticación social (Google, LinkedIn, GitHub, Facebook) en Nova Work usando Supabase Auth.

## 📋 Requisitos Previos

- Proyecto de Supabase configurado
- Acceso al Dashboard de Supabase
- URLs de producción/desarrollo definidas

---

## 🌐 URLs de Callback Necesarias

**URL de Callback de Supabase:**
\`\`\`
https://ztyctomplxcvfqiyoswn.supabase.co/auth/v1/callback
\`\`\`

**URL de tu aplicación:**
- Desarrollo: `http://localhost:3000`
- Producción: `https://tudominio.com`

---

## 1️⃣ Configuración de Google OAuth

### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Navega a **APIs & Services** > **Credentials**

### Paso 2: Configurar OAuth Consent Screen

1. Click en **OAuth consent screen**
2. Selecciona **External** como tipo de usuario
3. Completa la información:
   - **App name:** Nova Work
   - **User support email:** tu-email@dominio.com
   - **Developer contact:** tu-email@dominio.com
4. Agrega scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Guarda los cambios

### Paso 3: Crear Credenciales OAuth

1. Click en **Create Credentials** > **OAuth 2.0 Client ID**
2. Tipo de aplicación: **Web application**
3. Nombre: **Nova Work Web**
4. **Authorized JavaScript origins:**
   \`\`\`
   http://localhost:3000
   https://tudominio.com
   https://ztyctomplxcvfqiyoswn.supabase.co
   \`\`\`
5. **Authorized redirect URIs:**
   \`\`\`
   https://ztyctomplxcvfqiyoswn.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   https://tudominio.com/auth/callback
   \`\`\`
6. Click **Create**
7. Copia el **Client ID** y **Client Secret**

### Paso 4: Configurar en Supabase

1. Ve al Dashboard de Supabase: [https://supabase.com/dashboard/project/ztyctomplxcvfqiyoswn](https://supabase.com/dashboard/project/ztyctomplxcvfqiyoswn)
2. Navega a **Authentication** > **Providers**
3. Encuentra **Google** y habilítalo
4. Pega el **Client ID** y **Client Secret**
5. Click **Save**

---

## 2️⃣ Configuración de LinkedIn OAuth

### Paso 1: Crear Aplicación en LinkedIn

1. Ve a [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click en **Create app**
3. Completa la información:
   - **App name:** Nova Work
   - **LinkedIn Page:** Tu página de empresa (o créala)
   - **Privacy policy URL:** `https://tudominio.com/privacy`
   - **App logo:** Logo de Nova Work
4. Click **Create app**

### Paso 2: Configurar OAuth

1. En la pestaña **Auth**
2. **Authorized redirect URLs for your app:**
   \`\`\`
   https://ztyctomplxcvfqiyoswn.supabase.co/auth/v1/callback
   \`\`\`
3. En **Products**, solicita acceso a:
   - **Sign In with LinkedIn**
4. Copia el **Client ID** y **Client Secret** de la pestaña **Auth**

### Paso 3: Configurar en Supabase

1. Ve al Dashboard de Supabase
2. Navega a **Authentication** > **Providers**
3. Encuentra **LinkedIn** y habilítalo (puede estar en "More providers")
4. Pega el **Client ID** y **Client Secret**
5. Click **Save**

---

## 3️⃣ Configuración de GitHub OAuth

### Paso 1: Registrar OAuth App

1. Ve a [GitHub Settings](https://github.com/settings/developers)
2. Click en **OAuth Apps** > **New OAuth App**
3. Completa la información:
   - **Application name:** Nova Work
   - **Homepage URL:** `https://tudominio.com`
   - **Authorization callback URL:**
     \`\`\`
     https://ztyctomplxcvfqiyoswn.supabase.co/auth/v1/callback
     \`\`\`
4. Click **Register application**
5. Copia el **Client ID**
6. Click **Generate a new client secret** y cópialo

### Paso 2: Configurar en Supabase

1. Ve al Dashboard de Supabase
2. Navega a **Authentication** > **Providers**
3. Encuentra **GitHub** y habilítalo
4. Pega el **Client ID** y **Client Secret**
5. Click **Save**

---

## 4️⃣ Configuración de Facebook OAuth

### Paso 1: Crear Aplicación en Facebook

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Click en **My Apps** > **Create App**
3. Selecciona **Consumer** como tipo de app
4. Completa la información:
   - **App name:** Nova Work
   - **App contact email:** tu-email@dominio.com
5. Click **Create App**

### Paso 2: Configurar Facebook Login

1. En el dashboard de la app, busca **Facebook Login**
2. Click en **Set Up**
3. Selecciona **Web**
4. **Site URL:** `https://tudominio.com`
5. En el menú lateral, ve a **Facebook Login** > **Settings**
6. **Valid OAuth Redirect URIs:**
   \`\`\`
   https://ztyctomplxcvfqiyoswn.supabase.co/auth/v1/callback
   \`\`\`
7. Click **Save Changes**

### Paso 3: Obtener Credenciales

1. Ve a **Settings** > **Basic**
2. Copia el **App ID** (Client ID)
3. Click **Show** en **App Secret** y cópialo (Client Secret)

### Paso 4: Configurar en Supabase

1. Ve al Dashboard de Supabase
2. Navega a **Authentication** > **Providers**
3. Encuentra **Facebook** y habilítalo
4. Pega el **App ID** como Client ID
5. Pega el **App Secret** como Client Secret
6. Click **Save**

---

## ✅ Verificación de Configuración

### 1. Probar cada proveedor

Visita tu aplicación y prueba cada botón de inicio de sesión social:

\`\`\`
http://localhost:3000/auth
\`\`\`

### 2. Verificar flujo completo

1. Click en el botón del proveedor (ej: "Continuar con Google")
2. Autoriza la aplicación en la pantalla del proveedor
3. Deberías ser redirigido a `/auth/callback`
4. Y luego a `/feed` (o la página principal)

### 3. Verificar en Supabase

1. Ve a **Authentication** > **Users** en Supabase Dashboard
2. Deberías ver el nuevo usuario creado
3. Verifica que el proveedor esté listado correctamente

---

## 🔧 Solución de Problemas Comunes

### Error: "redirect_uri_mismatch"

**Causa:** La URL de redirección no coincide con las configuradas.

**Solución:**
1. Verifica que hayas agregado la URL exacta en el proveedor
2. Asegúrate de incluir `https://` o `http://`
3. No agregues `/` al final de la URL

### Error: "Invalid client"

**Causa:** El Client ID o Client Secret son incorrectos.

**Solución:**
1. Copia nuevamente las credenciales del proveedor
2. Asegúrate de que no haya espacios al inicio o final
3. Regenera el Client Secret si es necesario

### Usuario no se crea en tabla profiles

**Causa:** Falta el trigger automático de creación de perfil.

**Solución:** Ejecuta este SQL en Supabase:

\`\`\`sql
-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agregar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
\`\`\`

---

## 🌍 Configuración para Producción

Cuando despliegues a producción:

1. **Actualiza todas las URLs de callback** en cada proveedor
2. **Cambia de HTTP a HTTPS**
3. **Configura dominio personalizado** en Supabase (opcional)
4. **Verifica políticas de privacidad** estén publicadas
5. **Solicita verificación** de apps (Google, Facebook) para usuarios ilimitados

---

## 📝 Checklist de Configuración

- [ ] Google OAuth configurado
- [ ] LinkedIn OAuth configurado
- [ ] GitHub OAuth configurado
- [ ] Facebook OAuth configurado
- [ ] Trigger de creación de perfil instalado
- [ ] URLs de callback actualizadas para producción
- [ ] Probado cada proveedor en desarrollo
- [ ] Políticas de privacidad y términos publicados

---

## 🆘 Soporte

Si necesitas ayuda adicional:

- **Supabase Docs:** https://supabase.com/docs/guides/auth
- **Google OAuth:** https://developers.google.com/identity/protocols/oauth2
- **LinkedIn API:** https://docs.microsoft.com/en-us/linkedin/
- **GitHub OAuth:** https://docs.github.com/en/developers/apps/building-oauth-apps
- **Facebook Login:** https://developers.facebook.com/docs/facebook-login

---

**✅ Una vez configurado todo, Nova Work estará listo para autenticación social completa!**
