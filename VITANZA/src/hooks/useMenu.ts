import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types';

export const useMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Convertir los datos de Supabase al formato MenuItem
      const menuItems: MenuItem[] = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: item.image || '',
        macros: {
          calories: Number(item.calories),
          protein: Number(item.protein),
          carbs: Number(item.carbs),
          fat: Number(item.fats),
          fiber: Number(item.fiber),
        },
        category: item.category,
        ingredients: item.ingredients || [],
        allergens: item.allergens || [],
        isVegetarian: item.is_vegetarian,
        isGlutenFree: item.is_gluten_free,
        isValidated: item.is_validated,
        validatedBy: item.validated_by || undefined,
        preparationTime: item.preparation_time || 15,
      }));

      setItems(menuItems);
    } catch (err: any) {
      console.error('Error al obtener menú:', err);
      setError(err.message || 'Error al cargar el menú');
    } finally {
      setIsLoading(false);
    }
  };

  return { items, isLoading, error, refetch: fetchMenuItems };
};
