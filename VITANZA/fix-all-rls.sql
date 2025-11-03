-- ============================================
-- DESACTIVAR RLS EN TODAS LAS TABLAS
-- ============================================
--
-- Este script desactiva Row Level Security en todas
-- las tablas para desarrollo.
--
-- ⚠️ EJECUTAR ESTO UNA SOLA VEZ
--
-- Para ejecutar:
-- 1. Ve a Supabase Dashboard > SQL Editor
-- 2. Pega este código completo
-- 3. Click en "Run"
-- ============================================

-- Desactivar RLS en todas las tablas
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_customizations DISABLE ROW LEVEL SECURITY;

-- Verificar que todo está desactivado
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'menu_items',
    'orders',
    'order_items',
    'cart_sessions',
    'cart_customizations'
  )
ORDER BY tablename;

-- Resultado esperado: rowsecurity = false para todas las tablas

-- ============================================
-- ✅ RLS desactivado en todas las tablas
-- ============================================
