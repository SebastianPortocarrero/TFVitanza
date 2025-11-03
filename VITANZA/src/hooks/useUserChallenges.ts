import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Challenge } from '../types';

interface UserChallengeData {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  reward: number;
  endsAt: Date;
  type: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
}

export const useUserChallenges = (userId: string | undefined) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    fetchUserChallenges();
  }, [userId]);

  const fetchUserChallenges = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1. Obtener todos los desafíos activos
      const { data: activeChallenges, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true);

      if (challengesError) throw challengesError;
      if (!activeChallenges) {
        setChallenges([]);
        return;
      }

      // 2. Obtener el progreso del usuario en estos desafíos
      const { data: userProgress, error: progressError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      // 3. Crear registros de progreso para desafíos que el usuario no tiene
      const progressMap = new Map(
        userProgress?.map((p) => [p.challenge_id, p]) || []
      );

      const missingChallenges = activeChallenges.filter(
        (challenge) => !progressMap.has(challenge.id)
      );

      if (missingChallenges.length > 0) {
        // Insertar uno por uno para evitar conflictos 409
        for (const challenge of missingChallenges) {
          const { data: createdProgress, error: createError } = await supabase
            .from('user_challenges')
            .insert({
              user_id: userId,
              challenge_id: challenge.id,
              current_progress: 0,
              is_completed: false,
            })
            .select()
            .single();

          // Ignorar error 409 (ya existe), pero loguear otros errores
          if (createError && createError.code !== '23505') {
            console.error('Error creating user challenge progress:', createError);
          } else if (createdProgress) {
            // Agregar el nuevo registro al mapa
            progressMap.set(challenge.id, createdProgress);
          }
        }
      }

      // 4. Calcular fecha de fin basada en el tipo de desafío
      const now = new Date();
      const getEndDate = (type: string): Date => {
        const date = new Date(now);
        switch (type) {
          case 'daily':
            date.setHours(23, 59, 59, 999);
            return date;
          case 'weekly':
            const daysUntilSunday = 7 - date.getDay();
            date.setDate(date.getDate() + daysUntilSunday);
            date.setHours(23, 59, 59, 999);
            return date;
          case 'monthly':
            date.setMonth(date.getMonth() + 1);
            date.setDate(0); // Último día del mes actual
            date.setHours(23, 59, 59, 999);
            return date;
          default:
            return new Date(date.setDate(date.getDate() + 7));
        }
      };

      // 5. Combinar desafíos con progreso del usuario
      const formattedChallenges: Challenge[] = activeChallenges.map((challenge) => {
        const progress = progressMap.get(challenge.id);

        return {
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          goal: challenge.target_value || 100,
          current: progress?.current_progress || 0,
          reward: challenge.points || 0,
          endsAt: getEndDate(challenge.type),
          type: challenge.type as 'daily' | 'weekly' | 'monthly',
        };
      });

      setChallenges(formattedChallenges);
    } catch (err: any) {
      console.error('Error fetching user challenges:', err);
      setError(err.message || 'Error al cargar desafíos');
    } finally {
      setIsLoading(false);
    }
  };

  const updateChallengeProgress = async (
    challengeId: string,
    newProgress: number
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_challenges')
        .update({
          current_progress: newProgress,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);

      if (error) throw error;

      // Actualizar estado local
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, current: newProgress }
            : challenge
        )
      );
    } catch (err: any) {
      console.error('Error updating challenge progress:', err);
    }
  };

  const completeChallengeLocally = async (challengeId: string) => {
    if (!userId) return;

    try {
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!challenge) return;

      const { error } = await supabase
        .from('user_challenges')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);

      if (error) throw error;

      // Actualizar puntos del usuario
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({
          points: supabase.raw(`points + ${challenge.reward}`),
        })
        .eq('id', userId);

      if (pointsError) {
        console.error('Error updating user points:', pointsError);
      }

      // Refrescar desafíos
      await fetchUserChallenges();
    } catch (err: any) {
      console.error('Error completing challenge:', err);
    }
  };

  return {
    challenges,
    isLoading,
    error,
    updateChallengeProgress,
    completeChallengeLocally,
    refreshChallenges: fetchUserChallenges,
  };
};
