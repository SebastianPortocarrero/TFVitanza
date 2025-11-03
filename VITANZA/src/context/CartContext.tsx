import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, CustomizationRule, Macros } from '../types';
import { useAuth } from './AuthContext';
import { useCartSession } from '../hooks/useCartSession';

interface CartContextType {
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    customizations: CustomizationRule[],
    quantity?: number
  ) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const calculateCustomizedMacros = (
  baseMacros: Macros,
  customizations: CustomizationRule[]
): Macros => {
  const result = { ...baseMacros };

  customizations.forEach((custom) => {
    if (custom.macroModifier.calories) {
      result.calories += custom.macroModifier.calories;
    }
    if (custom.macroModifier.protein) {
      result.protein += custom.macroModifier.protein;
    }
    if (custom.macroModifier.carbs) {
      result.carbs += custom.macroModifier.carbs;
    }
    if (custom.macroModifier.fat) {
      result.fat += custom.macroModifier.fat;
    }
    if (custom.macroModifier.fiber && result.fiber !== undefined) {
      result.fiber += custom.macroModifier.fiber;
    }
  });

  return result;
};

const calculateCustomizedPrice = (
  basePrice: number,
  customizations: CustomizationRule[]
): number => {
  return customizations.reduce((total, custom) => total + custom.priceModifier, basePrice);
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const cartSession = useCartSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar carrito al iniciar
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (user) {
      // Usuario autenticado: cargar desde Supabase
      console.log('📦 Cargando carrito desde Supabase...');
      const cartItems = await cartSession.fetchCart();
      setItems(cartItems);
    } else {
      // Usuario no autenticado: cargar desde localStorage
      console.log('📦 Cargando carrito desde localStorage...');
      const savedCart = localStorage.getItem('vitanza_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    }
  };

  // Guardar en localStorage solo si NO hay usuario
  useEffect(() => {
    if (!user && items.length >= 0) {
      localStorage.setItem('vitanza_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = async (
    menuItem: MenuItem,
    customizations: CustomizationRule[],
    quantity: number = 1
  ) => {
    const customizedMacros = calculateCustomizedMacros(menuItem.macros, customizations);
    const customizedPrice = calculateCustomizedPrice(menuItem.price, customizations);

    const newItem: CartItem = {
      menuItem,
      quantity,
      customizations,
      customizedMacros,
      customizedPrice,
    };

    // Actualizar estado local inmediatamente
    setItems((prev) => [...prev, newItem]);

    // Si hay usuario, guardar en Supabase
    if (user) {
      try {
        await cartSession.addCartItem(
          menuItem,
          customizations,
          customizedMacros,
          customizedPrice,
          quantity
        );
        // Recargar desde Supabase para obtener el ID
        await loadCart();
      } catch (error) {
        console.error('Error al guardar en Supabase:', error);
      }
    }
  };

  const removeItem = async (index: number) => {
    const item = items[index];

    // Actualizar estado local
    setItems((prev) => prev.filter((_, i) => i !== index));

    // Si hay usuario y el item tiene cartSessionId, eliminar de Supabase
    if (user && item.cartSessionId) {
      try {
        await cartSession.removeCartItem(item.cartSessionId);
      } catch (error) {
        console.error('Error al eliminar de Supabase:', error);
        // Revertir cambio local si falla
        await loadCart();
      }
    }
  };

  const updateQuantity = async (index: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(index);
      return;
    }

    const item = items[index];

    // Actualizar estado local
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );

    // Si hay usuario y el item tiene cartSessionId, actualizar en Supabase
    if (user && item.cartSessionId) {
      try {
        await cartSession.updateCartItemQuantity(item.cartSessionId, quantity);
      } catch (error) {
        console.error('Error al actualizar en Supabase:', error);
        // Revertir cambio local si falla
        await loadCart();
      }
    }
  };

  const clearCart = async () => {
    // Actualizar estado local
    setItems([]);

    // Si hay usuario, limpiar en Supabase
    if (user) {
      try {
        await cartSession.clearCart();
      } catch (error) {
        console.error('Error al limpiar carrito en Supabase:', error);
      }
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.customizedPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
};
