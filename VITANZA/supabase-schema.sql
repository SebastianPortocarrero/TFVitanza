-- VITANZA Database Schema for Supabase
-- Execute this in Supabase SQL Editor: Dashboard > SQL Editor > New Query

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: profiles
-- Extiende la tabla auth.users de Supabase con datos adicionales
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CLIENTE' CHECK (role IN ('CLIENTE', 'ADMIN', 'NUTRI', 'STAFF')),
  avatar TEXT,
  phone TEXT,

  -- Datos fitness
  goal TEXT CHECK (goal IN ('muscle_gain', 'fat_loss', 'performance', 'health')),
  weight NUMERIC(5,2),
  height NUMERIC(5,2),

  -- Gamificación
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: menu_items
-- Catálogo de platillos disponibles
-- =====================================================
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  category TEXT NOT NULL,

  -- Información nutricional
  calories NUMERIC(8,2) NOT NULL,
  protein NUMERIC(8,2) NOT NULL,
  carbs NUMERIC(8,2) NOT NULL,
  fats NUMERIC(8,2) NOT NULL,
  fiber NUMERIC(8,2) NOT NULL,

  -- Detalles
  ingredients TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  preparation_time INTEGER, -- minutos

  -- Validación
  is_validated BOOLEAN DEFAULT FALSE,
  validated_by UUID REFERENCES public.profiles(id),
  validated_at TIMESTAMPTZ,

  -- Control
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: customization_rules
-- Reglas de personalización de platillos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.customization_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('protein', 'carbs', 'fiber', 'fats')),
  label TEXT NOT NULL,
  price_modifier NUMERIC(10,2) DEFAULT 0,

  -- Modificadores de macros
  calories_modifier NUMERIC(8,2) DEFAULT 0,
  protein_modifier NUMERIC(8,2) DEFAULT 0,
  carbs_modifier NUMERIC(8,2) DEFAULT 0,
  fats_modifier NUMERIC(8,2) DEFAULT 0,
  fiber_modifier NUMERIC(8,2) DEFAULT 0,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: orders
-- Pedidos realizados por usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Estado del pedido
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN (
    'received', 'preparing', 'ready', 'en_route', 'delivered', 'cancelled'
  )),

  -- Tipo de servicio
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('delivery', 'pickup', 'dine_in')),

  -- Información de entrega
  delivery_address TEXT,
  delivery_phone TEXT,

  -- Pago
  payment_method TEXT CHECK (payment_method IN ('card', 'yape', 'plin', 'cash')),
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,

  -- Tiempo estimado
  estimated_time INTEGER, -- minutos

  -- Notas
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- =====================================================
-- TABLA: order_items
-- Items individuales de cada pedido
-- =====================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,

  -- Snapshot del item al momento de la compra
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,

  -- Macros customizadas
  calories NUMERIC(8,2),
  protein NUMERIC(8,2),
  carbs NUMERIC(8,2),
  fats NUMERIC(8,2),
  fiber NUMERIC(8,2),

  -- Precio customizado
  customized_price NUMERIC(10,2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: order_item_customizations
-- Customizaciones aplicadas a cada item del pedido
-- =====================================================
CREATE TABLE IF NOT EXISTS public.order_item_customizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE CASCADE NOT NULL,
  customization_rule_id UUID REFERENCES public.customization_rules(id) ON DELETE SET NULL,

  -- Snapshot de la regla
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  price_modifier NUMERIC(10,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: cart_sessions (OPCIONAL - para carrito persistente)
-- Guarda carritos de usuarios entre sesiones
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cart_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,

  -- Macros customizadas
  calories NUMERIC(8,2),
  protein NUMERIC(8,2),
  carbs NUMERIC(8,2),
  fats NUMERIC(8,2),
  fiber NUMERIC(8,2),

  -- Precio customizado
  customized_price NUMERIC(10,2) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, menu_item_id, calories, protein, carbs) -- Evita duplicados exactos
);

-- =====================================================
-- TABLA: cart_customizations
-- Customizaciones del carrito
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cart_customizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cart_session_id UUID REFERENCES public.cart_sessions(id) ON DELETE CASCADE NOT NULL,
  customization_rule_id UUID REFERENCES public.customization_rules(id) ON DELETE CASCADE NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: challenges (Desafíos)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
  points INTEGER NOT NULL,
  icon TEXT,

  -- Requisitos
  target_value INTEGER, -- ej: 30 días, 2000 calorías

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLA: user_challenges
-- Progreso de usuarios en desafíos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,

  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, challenge_id)
);

-- =====================================================
-- ÍNDICES para mejorar rendimiento
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_user_id ON public.cart_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available);

-- =====================================================
-- FUNCIONES: Auto-actualizar updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_sessions_updated_at BEFORE UPDATE ON public.cart_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Los admins pueden ver todos los perfiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF')
    )
  );

-- Políticas para menu_items (todos pueden leer, solo admins/nutris pueden escribir)
CREATE POLICY "Cualquiera puede ver items del menú disponibles"
  ON public.menu_items FOR SELECT
  USING (is_available = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Solo admins/nutris pueden crear items"
  ON public.menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'NUTRI')
    )
  );

CREATE POLICY "Solo admins/nutris pueden actualizar items"
  ON public.menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'NUTRI')
    )
  );

-- Políticas para orders
CREATE POLICY "Los usuarios pueden ver sus propios pedidos"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios pedidos"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los admins/staff pueden ver todos los pedidos"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF')
    )
  );

CREATE POLICY "Los admins/staff pueden actualizar pedidos"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF')
    )
  );

-- Políticas para order_items (heredan de orders)
CREATE POLICY "Los usuarios pueden ver items de sus pedidos"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

-- Políticas para cart_sessions
CREATE POLICY "Los usuarios pueden ver su propio carrito"
  ON public.cart_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden gestionar su propio carrito"
  ON public.cart_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Políticas para challenges (todos pueden leer)
CREATE POLICY "Cualquiera puede ver desafíos activos"
  ON public.challenges FOR SELECT
  USING (is_active = TRUE);

-- Políticas para user_challenges
CREATE POLICY "Los usuarios pueden ver su progreso en desafíos"
  ON public.user_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su progreso"
  ON public.user_challenges FOR ALL
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCIÓN: Crear perfil automáticamente al registrarse
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.email = 'admin@vitanza.pe' THEN 'ADMIN'
      ELSE 'CLIENTE'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- DATOS INICIALES: Customization Rules
-- =====================================================
INSERT INTO public.customization_rules (type, label, price_modifier, protein_modifier, calories_modifier) VALUES
  ('protein', '+30g Proteína', 8.00, 30, 120),
  ('carbs', '-20g Carbohidratos', 0.00, 0, -80),
  ('fiber', '+10g Fibra', 3.00, 0, 20)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DATOS INICIALES: Challenges (opcional)
-- =====================================================
INSERT INTO public.challenges (title, description, type, points, target_value) VALUES
  ('Desafío 30 días proteína', 'Consume al menos 120g de proteína durante 30 días consecutivos', 'monthly', 500, 30),
  ('Come Saludable esta Semana', 'Ordena al menos 5 veces en la semana', 'weekly', 100, 5),
  ('Meta Diaria de Calorías', 'Mantén tu ingesta dentro de tu objetivo calórico', 'daily', 20, 1)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================

-- Para verificar que todo se creó correctamente:
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
