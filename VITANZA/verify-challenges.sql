-- Verificar que los desafíos existen en la base de datos
-- Ejecutar esto en Supabase SQL Editor para verificar

-- 1. Ver todos los desafíos activos
SELECT
  id,
  title,
  description,
  type,
  points,
  target_value,
  is_active
FROM public.challenges
WHERE is_active = true
ORDER BY type, created_at;

-- 2. Ver el progreso de un usuario específico en los desafíos
-- Reemplaza 'USER_ID_AQUI' con el ID real del usuario
SELECT
  uc.id,
  c.title,
  c.type,
  uc.current_progress,
  c.target_value as goal,
  uc.is_completed,
  c.points as reward
FROM public.user_challenges uc
JOIN public.challenges c ON c.id = uc.challenge_id
WHERE uc.user_id = 'USER_ID_AQUI'
ORDER BY c.type, c.created_at;

-- 3. Ver cuántos usuarios tienen registros de desafíos
SELECT
  COUNT(DISTINCT user_id) as total_usuarios_con_desafios,
  COUNT(*) as total_registros_progreso
FROM public.user_challenges;

-- 4. Si no hay desafíos, crearlos manualmente
INSERT INTO public.challenges (title, description, type, points, target_value) VALUES
  ('Desafío 30 Días de Proteína', 'Consume al menos 120g de proteína diaria durante 30 días consecutivos', 'monthly', 500, 30),
  ('Come Saludable Esta Semana', 'Ordena al menos 5 platillos de VITANZA esta semana', 'weekly', 100, 5),
  ('Meta Diaria de Calorías', 'Mantén tu consumo calórico dentro de tu objetivo hoy', 'daily', 20, 1)
ON CONFLICT DO NOTHING;
