# Setup VITANZA con Supabase

## ✅ Completado

### Fase 1: Autenticación ✅
- Login y registro con Supabase Auth
- Usuarios guardados en PostgreSQL
- Validación real de contraseñas

### Fase 2: Menú ✅
- Platillos cargados desde Supabase
- Filtros funcionando
- Detalles de platillos desde BD

### Fase 3: Carrito Persistente ✅
- Carrito guardado en Supabase para usuarios autenticados
- localStorage para usuarios no autenticados
- Sincronización automática entre dispositivos

### Fase 4: Sistema de Pedidos ✅
- Pedidos guardados en Supabase con todos sus items
- Historial de pedidos en Dashboard con estadísticas reales
- Tracking de estado de pedidos en tiempo real
- Vista detallada de cada pedido desde la base de datos

## 📁 Archivos SQL (Solo 3 archivos)

**Ejecuta EN ORDEN:**

1. `supabase-schema.sql` - Schema de base de datos completo
2. `seed-menu-data.sql` - 12 platillos iniciales
3. `fix-all-rls.sql` - Desactiva RLS para desarrollo

## 🚀 Cómo Usar

### **PASO 1: Ejecutar SQL (UNA SOLA VEZ)**

Ve a **Supabase Dashboard > SQL Editor** y ejecuta el archivo `fix-all-rls.sql`

Esto desactivará las políticas de seguridad que están bloqueando la app.

### **PASO 2: Ejecutar app**

```bash
npm run dev
```

### **PASO 3: Usar la app**

1. Ve a http://localhost:5173
2. **Regístrate** con tu email
3. **Login** - Ahora debería funcionar sin quedarse cargando ✅
4. La app funcionará como una app normal, sin necesidad de limpiar localStorage ni nada manual

## 🔧 Si algo falla

**La app se queda cargando infinitamente:**
- Asegúrate de haber ejecutado `fix-all-rls.sql` en Supabase
- Abre la consola del navegador (F12) y ejecuta: `localStorage.clear()`
- Recarga la página (F5)
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
```

**Verificar platillos:**
```sql
SELECT COUNT(*) FROM public.menu_items;
-- Debería devolver 12
```

**Crear perfil manualmente:**
```sql
INSERT INTO public.profiles (id, email, name, role)
SELECT u.id, u.email, split_part(u.email, '@', 1), 'CLIENTE'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

## 🧪 Probar Pedidos (Fase 4)

1. **Ejecuta fix-orders-rls.sql** en Supabase SQL Editor
2. Haz login en la app
3. Agrega platillos al carrito y completa un pedido
4. Verifica en **Supabase > Table Editor > orders** y **order_items**
5. Ve a tu Dashboard → Deberías ver el pedido y estadísticas actualizadas ✅

**Ver pedidos en BD:**
```sql
SELECT
  o.id,
  o.status,
  o.fulfillment_type,
  o.total,
  o.created_at,
  COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC;
```

**Ver items de un pedido:**
```sql
SELECT
  oi.name as platillo,
  oi.quantity,
  oi.customized_price,
  oi.calories,
  oi.protein,
  oi.carbs,
  oi.fats
FROM order_items oi
WHERE oi.order_id = 'TU_ORDER_ID'
ORDER BY oi.created_at;
```

## 📋 Pendientes

### Fase 5: Panel Admin (Próximo)
- Gestión de menú desde app
- Ver todos los pedidos (admin)
- Actualizar estado de pedidos
- Estadísticas y métricas reales
- Gestión de usuarios
