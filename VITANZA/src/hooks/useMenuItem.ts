import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

export const useMenuItem = (id: string) => {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMenuItem(id);
    }
  }, [id]);

  const fetchMenuItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw new Error('Platillo no encontrado');
      }

      // Convertir los datos de Supabase al formato MenuItem
      const menuItem: MenuItem = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: data.image || '',
        macros: {
          calories: Number(data.calories),
          protein: Number(data.protein),
          carbs: Number(data.carbs),
          fat: Number(data.fats),
          fiber: Number(data.fiber),
        },
        category: data.category,
        ingredients: data.ingredients || [],
        allergens: data.allergens || [],
        isVegetarian: data.is_vegetarian,
        isGlutenFree: data.is_gluten_free,
        isValidated: data.is_validated,
        validatedBy: data.validated_by || undefined,
        preparationTime: data.preparation_time || 15,
      };

      setItem(menuItem);
    } catch (err: any) {
      console.error('Error al obtener platillo:', err);
      setError(err.message || 'Error al cargar el platillo');
    } finally {
      setIsLoading(false);
    }
  };

  return { item, isLoading, error, refetch: () => fetchMenuItem(id) };
};
