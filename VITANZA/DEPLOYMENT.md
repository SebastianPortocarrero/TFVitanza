# 🚀 Guía de Deployment a Vercel - VITANZA

Esta guía te ayudará a desplegar tu aplicación VITANZA en Vercel.

## 📋 Pre-requisitos

1. Cuenta en [Vercel](https://vercel.com) (puedes usar GitHub, GitLab o Bitbucket)
2. Cuenta en [GitHub](https://github.com) (recomendado)
3. Proyecto de Supabase funcionando

## 🔧 Paso 1: Preparar el Repositorio Git

Si aún no has inicializado Git en tu proyecto:

```bash
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer primer commit
git commit -m "Initial commit - VITANZA app"
```

## 📤 Paso 2: Subir a GitHub

1. Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio llamado `vitanza`
2. **NO marques** "Add a README file" ni ".gitignore" (ya los tienes)
3. Copia los comandos que GitHub te muestra:

```bash
git remote add origin https://github.com/TU_USUARIO/vitanza.git
git branch -M main
git push -u origin main
```

## 🌐 Paso 3: Desplegar en Vercel

### Opción A: Desde el Dashboard de Vercel (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Haz clic en **"Import Git Repository"**
3. Selecciona tu repositorio `vitanza`
4. Vercel detectará automáticamente que es un proyecto Vite
5. **IMPORTANTE:** Configura las variables de entorno:

   **Environment Variables:**
   - `VITE_SUPABASE_URL` = `https://ozzhjlbukmvdijadzdkc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhqbGJ1a212ZGlqYWR6ZGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMTM3OTcsImV4cCI6MjA3NzY4OTc5N30.3-x14JYOM8kH894gWSlPbQ8uzjmXUg7y9hG1XuUpXU0`

6. Haz clic en **"Deploy"**
7. ¡Espera 2-3 minutos y listo! 🎉

### Opción B: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel

# Seguir las instrucciones en pantalla
# Cuando pregunte por environment variables, agregar las de arriba
```

## 🔐 Paso 4: Configurar Supabase para Vercel

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Authentication > URL Configuration**
3. Agrega tu URL de Vercel a **Site URL** y **Redirect URLs**:
   - Site URL: `https://tu-proyecto.vercel.app`
   - Redirect URLs: `https://tu-proyecto.vercel.app/**`

## ✅ Verificación

Después del deployment, verifica:

1. ✅ La página carga correctamente
2. ✅ Puedes hacer login
3. ✅ El menú muestra los platillos
4. ✅ Puedes agregar al carrito
5. ✅ El admin panel funciona

## 🔄 Actualizaciones Automáticas

Ahora cada vez que hagas `git push` a tu repositorio, Vercel desplegará automáticamente los cambios:

```bash
# Hacer cambios en tu código
git add .
git commit -m "Descripción de cambios"
git push

# Vercel desplegará automáticamente en ~2 minutos
```

## 🐛 Troubleshooting

### Error: "Failed to load environment variables"
- Verifica que las variables de entorno estén configuradas en Vercel Dashboard
- Ve a tu proyecto > Settings > Environment Variables

### Error: "404 on refresh"
- El archivo `vercel.json` ya está configurado correctamente
- Verifica que el archivo existe en tu repositorio

### Error de CORS con Supabase
- Verifica que agregaste tu dominio de Vercel en Supabase > Authentication > URL Configuration

### Build fails
- Verifica que `npm run build` funcione localmente
- Revisa los logs en Vercel Dashboard

## 📱 URLs Importantes

Después del deployment tendrás:

- **URL de producción:** `https://tu-proyecto.vercel.app`
- **Dashboard de Vercel:** `https://vercel.com/dashboard`
- **Logs en tiempo real:** Dashboard > Tu Proyecto > Deployments > Logs

## 🎯 Dominios Personalizados (Opcional)

Si tienes un dominio como `vitanza.pe`:

1. Ve a tu proyecto en Vercel
2. Settings > Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones de DNS
5. Actualiza las URLs en Supabase

---

## 🆘 Necesitas Ayuda?

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Vite](https://vitejs.dev/guide/static-deploy.html)
- [Documentación de Supabase](https://supabase.com/docs)
