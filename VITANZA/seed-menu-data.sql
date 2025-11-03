-- Script para insertar los datos del menú de VITANZA en Supabase
-- Ejecuta este script en el SQL Editor de Supabase después de crear el schema

-- =====================================================
-- INSERTAR ITEMS DEL MENÚ
-- =====================================================

INSERT INTO public.menu_items (
  name, description, price, image, category,
  calories, protein, carbs, fats, fiber,
  ingredients, allergens, is_vegetarian, is_gluten_free,
  is_validated, preparation_time, is_available
) VALUES

-- 1. Power Bowl de Pollo
('Power Bowl de Pollo',
 'Pechuga de pollo a la parrilla, quinoa, brócoli, zanahoria y aguacate',
 28.00,
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Bowls',
 520, 45, 52, 12, 8,
 ARRAY['Pechuga de pollo', 'Quinoa', 'Brócoli', 'Zanahoria', 'Aguacate', 'Aceite de oliva'],
 ARRAY[]::TEXT[],
 FALSE, TRUE, TRUE, 15, TRUE),

-- 2. Wrap de Atún Mediterráneo
('Wrap de Atún Mediterráneo',
 'Atún, hummus, tomate, lechuga, pepino y aceitunas en tortilla integral',
 24.00,
 'https://es.starkist.com/wp-content/uploads/2014/12/recipes_mediterranean_tuna_wrap.jpg',
 'Wraps',
 380, 32, 38, 10, 6,
 ARRAY['Atún', 'Hummus', 'Tomate', 'Lechuga', 'Pepino', 'Aceitunas', 'Tortilla integral'],
 ARRAY['Gluten', 'Pescado'],
 FALSE, FALSE, TRUE, 10, TRUE),

-- 3. Ensalada Fitness de Salmón
('Ensalada Fitness de Salmón',
 'Salmón ahumado, espinaca, quinoa roja, frutos secos y vinagreta de limón',
 32.00,
 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Ensaladas',
 420, 38, 28, 18, 5,
 ARRAY['Salmón ahumado', 'Espinaca', 'Quinoa roja', 'Almendras', 'Nueces', 'Vinagreta de limón'],
 ARRAY['Pescado', 'Frutos secos'],
 FALSE, TRUE, TRUE, 12, TRUE),

-- 4. Bowl Vegano de Garbanzos
('Bowl Vegano de Garbanzos',
 'Garbanzos especiados, arroz integral, kale, pimiento, tahini',
 22.00,
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Bowls',
 480, 18, 68, 14, 12,
 ARRAY['Garbanzos', 'Arroz integral', 'Kale', 'Pimiento', 'Tahini', 'Comino', 'Pimentón'],
 ARRAY['Sésamo'],
 TRUE, TRUE, TRUE, 18, TRUE),

-- 5. Pechuga al Limón con Camote
('Pechuga al Limón con Camote',
 'Pechuga de pollo con limón, camote asado y ejotes al vapor',
 26.00,
 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Platos Calientes',
 440, 42, 48, 8, 7,
 ARRAY['Pechuga de pollo', 'Limón', 'Camote', 'Ejotes', 'Ajo', 'Hierbas'],
 ARRAY[]::TEXT[],
 FALSE, TRUE, TRUE, 20, TRUE),

-- 6. Bowl de Carne Magra y Batata
('Bowl de Carne Magra y Batata',
 'Lomo fino, batata asada, espinaca y salsa chimichurri light',
 34.00,
 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Bowls',
 560, 48, 55, 15, 9,
 ARRAY['Lomo fino', 'Batata', 'Espinaca', 'Chimichurri light', 'Ajo', 'Perejil'],
 ARRAY[]::TEXT[],
 FALSE, TRUE, FALSE, 22, TRUE),

-- 7. Wrap de Pollo y Aguacate
('Wrap de Pollo y Aguacate',
 'Pollo desmenuzado, aguacate, lechuga, tomate y yogurt griego en tortilla',
 23.00,
 'https://vitalplus.com.co/cdn/shop/articles/Wraps-de-Pollo-y-Aguacate.jpg?v=1692044544',
 'Wraps',
 410, 35, 36, 14, 6,
 ARRAY['Pollo', 'Aguacate', 'Lechuga', 'Tomate', 'Yogurt griego', 'Tortilla integral'],
 ARRAY['Gluten', 'Lácteos'],
 FALSE, FALSE, TRUE, 12, TRUE),

-- 8. Ensalada Protein Power
('Ensalada Protein Power',
 'Mix de lechugas, pollo, huevo, garbanzos, tomate cherry y aderezo de mostaza',
 27.00,
 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Ensaladas',
 390, 40, 25, 12, 8,
 ARRAY['Lechuga', 'Pollo', 'Huevo', 'Garbanzos', 'Tomate cherry', 'Mostaza Dijon'],
 ARRAY['Huevo', 'Mostaza'],
 FALSE, TRUE, TRUE, 10, TRUE),

-- 9. Bowl Asiático de Tofu
('Bowl Asiático de Tofu',
 'Tofu marinado, arroz jazmín, edamame, col morada y salsa teriyaki sin azúcar',
 24.00,
 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Bowls',
 460, 22, 58, 16, 10,
 ARRAY['Tofu', 'Arroz jazmín', 'Edamame', 'Col morada', 'Zanahoria', 'Salsa teriyaki'],
 ARRAY['Soja'],
 TRUE, TRUE, TRUE, 16, TRUE),

-- 10. Pavo a la Plancha con Verduras
('Pavo a la Plancha con Verduras',
 'Pechuga de pavo, calabacín, berenjena, pimiento y arroz integral',
 29.00,
 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Platos Calientes',
 450, 44, 46, 9, 8,
 ARRAY['Pechuga de pavo', 'Calabacín', 'Berenjena', 'Pimiento', 'Arroz integral', 'Hierbas'],
 ARRAY[]::TEXT[],
 FALSE, TRUE, FALSE, 20, TRUE),

-- 11. Hamburguesa Fitness de Pavo
('Hamburguesa Fitness de Pavo',
 'Hamburguesa de pavo magro, pan integral, aguacate, tomate y cebolla caramelizada',
 26.00,
 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Platos Calientes',
 480, 38, 42, 16, 7,
 ARRAY['Pavo molido', 'Pan integral', 'Aguacate', 'Tomate', 'Cebolla', 'Lechuga'],
 ARRAY['Gluten'],
 FALSE, FALSE, TRUE, 18, TRUE),

-- 12. Bowl Mexicano de Frijoles
('Bowl Mexicano de Frijoles',
 'Frijoles negros, arroz integral, pico de gallo, aguacate, queso fresco y jalapeños',
 21.00,
 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800',
 'Bowls',
 490, 20, 72, 14, 16,
 ARRAY['Frijoles negros', 'Arroz integral', 'Tomate', 'Cebolla', 'Aguacate', 'Queso fresco', 'Jalapeño'],
 ARRAY['Lácteos'],
 TRUE, TRUE, TRUE, 15, TRUE);

-- =====================================================
-- Verificar que se insertaron correctamente
-- =====================================================
SELECT
  name,
  category,
  price,
  calories,
  protein,
  is_validated
FROM public.menu_items
ORDER BY category, name;
