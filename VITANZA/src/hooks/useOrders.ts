import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Order, CartItem, OrderStatus, FulfillmentType, PaymentMethod } from '../types';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener pedidos del usuario
  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      return;
    }

    const userId = user.id; // Narrowing para TypeScript

    try {
      setIsLoading(true);

      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir a Order[]
      const formattedOrders: Order[] = (ordersData || []).map((order: any) => ({
        id: order.id,
        userId: order.user_id,
        items: order.order_items.map((item: any) => ({
          menuItem: {
            id: item.menu_items?.id || item.menu_item_id,
            name: item.name,
            description: item.menu_items?.description || '',
            price: Number(item.price),
            image: item.menu_items?.image || '',
            macros: {
              calories: Number(item.calories || 0),
              protein: Number(item.protein || 0),
              carbs: Number(item.carbs || 0),
              fat: Number(item.fats || 0),
              fiber: Number(item.fiber || 0),
            },
            category: item.menu_items?.category || '',
            ingredients: item.menu_items?.ingredients || [],
            allergens: item.menu_items?.allergens || [],
            isVegetarian: item.menu_items?.is_vegetarian || false,
            isGlutenFree: item.menu_items?.is_gluten_free || false,
            isValidated: item.menu_items?.is_validated || false,
            validatedBy: item.menu_items?.validated_by,
            preparationTime: item.menu_items?.preparation_time || 15,
          },
          quantity: item.quantity,
          customizations: [],
          customizedMacros: {
            calories: Number(item.calories || 0),
            protein: Number(item.protein || 0),
            carbs: Number(item.carbs || 0),
            fat: Number(item.fats || 0),
            fiber: Number(item.fiber || 0),
          },
          customizedPrice: Number(item.customized_price),
        })),
        total: Number(order.total),
        status: order.status as OrderStatus,
        fulfillmentType: order.fulfillment_type as FulfillmentType,
        deliveryAddress: order.delivery_address,
        estimatedTime: order.estimated_time || 30,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
      }));

      setOrders(formattedOrders);
      return formattedOrders;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Cargar pedidos cuando el usuario cambie
  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Crear nuevo pedido
  const createOrder = async (
    cartItems: CartItem[],
    fulfillmentType: FulfillmentType,
    deliveryAddress?: string,
    deliveryPhone?: string,
    paymentMethod?: PaymentMethod
  ): Promise<Order | null> => {
    if (!user?.id) {
      throw new Error('Usuario no autenticado');
    }

    const userId = user.id; // Narrowing para TypeScript

    try {
      setIsLoading(true);

      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.customizedPrice * item.quantity,
        0
      );
      const deliveryFee = fulfillmentType === 'delivery' ? 5.0 : 0;
      const total = subtotal + deliveryFee;

      // Crear el pedido
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            status: 'received',
            fulfillment_type: fulfillmentType,
            delivery_address: deliveryAddress,
            delivery_phone: deliveryPhone,
            payment_method: paymentMethod || 'card',
            subtotal: subtotal,
            delivery_fee: deliveryFee,
            total: total,
            estimated_time: 30,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      console.log('✅ Pedido creado:', orderData.id);

      // Crear los items del pedido
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        calories: item.customizedMacros.calories,
        protein: item.customizedMacros.protein,
        carbs: item.customizedMacros.carbs,
        fats: item.customizedMacros.fat,
        fiber: item.customizedMacros.fiber,
        customized_price: item.customizedPrice,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      console.log('✅ Items del pedido guardados');

      // Retornar el pedido creado
      const newOrder: Order = {
        id: orderData.id,
        userId: userId,
        items: cartItems,
        total: total,
        status: 'received',
        fulfillmentType: fulfillmentType,
        deliveryAddress: deliveryAddress,
        estimatedTime: 30,
        createdAt: new Date(orderData.created_at),
        updatedAt: new Date(orderData.updated_at),
      };

      return newOrder;
    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener un pedido por ID
  const fetchOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      if (!orderData) return null;

      const order: Order = {
        id: orderData.id,
        userId: orderData.user_id,
        items: orderData.order_items.map((item: any) => ({
          menuItem: {
            id: item.menu_items?.id || item.menu_item_id,
            name: item.name,
            description: item.menu_items?.description || '',
            price: Number(item.price),
            image: item.menu_items?.image || '',
            macros: {
              calories: Number(item.calories || 0),
              protein: Number(item.protein || 0),
              carbs: Number(item.carbs || 0),
              fat: Number(item.fats || 0),
              fiber: Number(item.fiber || 0),
            },
            category: item.menu_items?.category || '',
            ingredients: item.menu_items?.ingredients || [],
            allergens: item.menu_items?.allergens || [],
            isVegetarian: item.menu_items?.is_vegetarian || false,
            isGlutenFree: item.menu_items?.is_gluten_free || false,
            isValidated: item.menu_items?.is_validated || false,
            validatedBy: item.menu_items?.validated_by,
            preparationTime: item.menu_items?.preparation_time || 15,
          },
          quantity: item.quantity,
          customizations: [],
          customizedMacros: {
            calories: Number(item.calories || 0),
            protein: Number(item.protein || 0),
            carbs: Number(item.carbs || 0),
            fat: Number(item.fats || 0),
            fiber: Number(item.fiber || 0),
          },
          customizedPrice: Number(item.customized_price),
        })),
        total: Number(orderData.total),
        status: orderData.status as OrderStatus,
        fulfillmentType: orderData.fulfillment_type as FulfillmentType,
        deliveryAddress: orderData.delivery_address,
        estimatedTime: orderData.estimated_time || 30,
        createdAt: new Date(orderData.created_at),
        updatedAt: new Date(orderData.updated_at),
      };

      return order;
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      return null;
    }
  };

  // Obtener TODOS los pedidos (para admin)
  const fetchAllOrders = async (): Promise<Order[]> => {
    try {
      setIsLoading(true);

      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          ),
          profiles (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir a Order[]
      const formattedOrders: Order[] = (ordersData || []).map((order: any) => ({
        id: order.id,
        userId: order.user_id,
        items: order.order_items.map((item: any) => ({
          menuItem: {
            id: item.menu_items?.id || item.menu_item_id,
            name: item.name,
            description: item.menu_items?.description || '',
            price: Number(item.price),
            image: item.menu_items?.image || '',
            macros: {
              calories: Number(item.calories || 0),
              protein: Number(item.protein || 0),
              carbs: Number(item.carbs || 0),
              fat: Number(item.fats || 0),
              fiber: Number(item.fiber || 0),
            },
            category: item.menu_items?.category || '',
            ingredients: item.menu_items?.ingredients || [],
            allergens: item.menu_items?.allergens || [],
            isVegetarian: item.menu_items?.is_vegetarian || false,
            isGlutenFree: item.menu_items?.is_gluten_free || false,
            isValidated: item.menu_items?.is_validated || false,
            validatedBy: item.menu_items?.validated_by,
            preparationTime: item.menu_items?.preparation_time || 15,
          },
          quantity: item.quantity,
          customizations: [],
          customizedMacros: {
            calories: Number(item.calories || 0),
            protein: Number(item.protein || 0),
            carbs: Number(item.carbs || 0),
            fat: Number(item.fats || 0),
            fiber: Number(item.fiber || 0),
          },
          customizedPrice: Number(item.customized_price),
        })),
        total: Number(order.total),
        status: order.status as OrderStatus,
        fulfillmentType: order.fulfillment_type,
        deliveryAddress: order.delivery_address,
        estimatedTime: order.estimated_time || 30,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at),
      }));

      return formattedOrders;
    } catch (error) {
      console.error('Error al obtener todos los pedidos:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar estado del pedido
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      console.log('✅ Estado del pedido actualizado');
      await fetchUserOrders(); // Recargar pedidos
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  };

  return {
    orders,
    isLoading,
    createOrder,
    fetchOrderById,
    fetchAllOrders,
    updateOrderStatus,
    refetch: fetchUserOrders,
  };
};
