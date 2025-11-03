import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CartItem, MenuItem, CustomizationRule } from '../types';

interface CartSessionData {
  id: string;
  menu_item_id: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  customized_price: number;
}

export const useCartSession = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener carrito desde Supabase
  const fetchCart = async (): Promise<CartItem[]> => {
    if (!user?.id) return [];

    const userId = user.id; // Narrowing para TypeScript

    try {
      setIsLoading(true);

      const { data: cartSessions, error } = await supabase
        .from('cart_sessions')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (!cartSessions || cartSessions.length === 0) {
        return [];
      }

      // Convertir a CartItem[]
      const cartItems: CartItem[] = await Promise.all(
        cartSessions.map(async (session: any) => {
          const menuItem = session.menu_items;

          // Obtener customizaciones de este item
          const { data: customizations } = await supabase
            .from('cart_customizations')
            .select('customization_rule_id')
            .eq('cart_session_id', session.id);

          // Por ahora, retornamos sin customizaciones detalladas
          // Ya que no guardamos el objeto completo de customizationRules
          return {
            cartSessionId: session.id, // Agregar el ID de la sesión
            menuItem: {
              id: menuItem.id,
              name: menuItem.name,
              description: menuItem.description,
              price: Number(menuItem.price),
              image: menuItem.image || '',
              macros: {
                calories: Number(menuItem.calories),
                protein: Number(menuItem.protein),
                carbs: Number(menuItem.carbs),
                fat: Number(menuItem.fats),
                fiber: Number(menuItem.fiber),
              },
              category: menuItem.category,
              ingredients: menuItem.ingredients || [],
              allergens: menuItem.allergens || [],
              isVegetarian: menuItem.is_vegetarian,
              isGlutenFree: menuItem.is_gluten_free,
              isValidated: menuItem.is_validated,
              validatedBy: menuItem.validated_by || undefined,
              preparationTime: menuItem.preparation_time || 15,
            },
            quantity: session.quantity,
            customizations: [], // TODO: cargar customizaciones reales
            customizedMacros: {
              calories: Number(session.calories),
              protein: Number(session.protein),
              carbs: Number(session.carbs),
              fat: Number(session.fats),
              fiber: Number(session.fiber),
            },
            customizedPrice: Number(session.customized_price),
          };
        })
      );

      return cartItems;
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar item al carrito
  const addCartItem = async (
    menuItem: MenuItem,
    customizations: CustomizationRule[],
    customizedMacros: any,
    customizedPrice: number,
    quantity: number
  ) => {
    if (!user?.id) {
      console.warn('Usuario no autenticado, no se puede guardar en Supabase');
      return;
    }

    const userId = user.id; // Narrowing para TypeScript

    try {
      // Insertar en cart_sessions
      const { data: cartSession, error } = await supabase
        .from('cart_sessions')
        .insert([
          {
            user_id: userId,
            menu_item_id: menuItem.id,
            quantity: quantity,
            calories: customizedMacros.calories,
            protein: customizedMacros.protein,
            carbs: customizedMacros.carbs,
            fats: customizedMacros.fat,
            fiber: customizedMacros.fiber,
            customized_price: customizedPrice,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Item agregado al carrito en Supabase');
    } catch (error) {
      console.error('❌ Error al agregar item al carrito:', error);
      throw error;
    }
  };

  // Eliminar item del carrito
  const removeCartItem = async (cartSessionId: string) => {
    if (!user?.id) return;

    const userId = user.id; // Narrowing para TypeScript

    try {
      const { error } = await supabase
        .from('cart_sessions')
        .delete()
        .eq('id', cartSessionId)
        .eq('user_id', userId);

      if (error) throw error;

      console.log('✅ Item eliminado del carrito');
    } catch (error) {
      console.error('❌ Error al eliminar item:', error);
      throw error;
    }
  };

  // Actualizar cantidad
  const updateCartItemQuantity = async (cartSessionId: string, quantity: number) => {
    if (!user?.id) return;

    const userId = user.id; // Narrowing para TypeScript

    try {
      if (quantity <= 0) {
        await removeCartItem(cartSessionId);
        return;
      }

      const { error } = await supabase
        .from('cart_sessions')
        .update({ quantity })
        .eq('id', cartSessionId)
        .eq('user_id', userId);

      if (error) throw error;

      console.log('✅ Cantidad actualizada');
    } catch (error) {
      console.error('❌ Error al actualizar cantidad:', error);
      throw error;
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    if (!user?.id) return;

    const userId = user.id; // Narrowing para TypeScript

    try {
      const { error } = await supabase
        .from('cart_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      console.log('✅ Carrito limpiado');
    } catch (error) {
      console.error('❌ Error al limpiar carrito:', error);
      throw error;
    }
  };

  return {
    fetchCart,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart,
    isLoading,
  };
};
