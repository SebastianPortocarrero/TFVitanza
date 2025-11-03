export type UserRole = 'CLIENTE' | 'ADMIN' | 'NUTRI' | 'STAFF';

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'en_route'
  | 'delivered'
  | 'cancelled';

export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'performance';

export type FulfillmentType = 'delivery' | 'pickup' | 'dine_in';

export type PaymentMethod = 'card' | 'yape' | 'plin' | 'cash';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Profile {
  userId: string;
  goal?: FitnessGoal;
  weight?: number;
  height?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietaryRestrictions: string[];
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  macros: Macros;
  category: string;
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isValidated: boolean;
  validatedBy?: string;
  preparationTime: number;
}

export interface CustomizationRule {
  id: string;
  type: 'protein' | 'carbs' | 'fiber';
  label: string;
  priceModifier: number;
  macroModifier: Partial<Macros>;
}

export interface CartItem {
  cartSessionId?: string; // ID de Supabase cart_sessions (opcional para localStorage)
  menuItem: MenuItem;
  quantity: number;
  customizations: CustomizationRule[];
  customizedMacros: Macros;
  customizedPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  paymentMethod?: PaymentMethod;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  reward: number;
  endsAt: Date;
  type: 'daily' | 'weekly' | 'monthly';
}

export interface LoyaltyPoints {
  userId: string;
  totalPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Nutritionist {
  id: string;
  name: string;
  photo: string;
  license: string;
  bio: string;
  specialties: string[];
}
