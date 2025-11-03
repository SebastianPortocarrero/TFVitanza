// Tipos generados para las tablas de Supabase
// Estos tipos deben coincidir con el schema en supabase-schema.sql

export type UserRole = 'CLIENTE' | 'ADMIN' | 'NUTRI' | 'STAFF';
export type OrderStatus = 'received' | 'preparing' | 'ready' | 'en_route' | 'delivered' | 'cancelled';
export type FulfillmentType = 'delivery' | 'pickup' | 'dine_in';
export type PaymentMethod = 'card' | 'yape' | 'plin' | 'cash';
export type CustomizationType = 'protein' | 'carbs' | 'fiber' | 'fats';
export type ChallengeType = 'daily' | 'weekly' | 'monthly';
export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'performance' | 'health';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: UserRole;
          avatar: string | null;
          phone: string | null;
          goal: FitnessGoal | null;
          weight: number | null;
          height: number | null;
          points: number;
          level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: UserRole;
          avatar?: string | null;
          phone?: string | null;
          goal?: FitnessGoal | null;
          weight?: number | null;
          height?: number | null;
          points?: number;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: UserRole;
          avatar?: string | null;
          phone?: string | null;
          goal?: FitnessGoal | null;
          weight?: number | null;
          height?: number | null;
          points?: number;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image: string | null;
          category: string;
          calories: number;
          protein: number;
          carbs: number;
          fats: number;
          fiber: number;
          ingredients: string[];
          allergens: string[];
          is_vegetarian: boolean;
          is_gluten_free: boolean;
          preparation_time: number | null;
          is_validated: boolean;
          validated_by: string | null;
          validated_at: string | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image?: string | null;
          category: string;
          calories: number;
          protein: number;
          carbs: number;
          fats: number;
          fiber: number;
          ingredients?: string[];
          allergens?: string[];
          is_vegetarian?: boolean;
          is_gluten_free?: boolean;
          preparation_time?: number | null;
          is_validated?: boolean;
          validated_by?: string | null;
          validated_at?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string | null;
          category?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fats?: number;
          fiber?: number;
          ingredients?: string[];
          allergens?: string[];
          is_vegetarian?: boolean;
          is_gluten_free?: boolean;
          preparation_time?: number | null;
          is_validated?: boolean;
          validated_by?: string | null;
          validated_at?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customization_rules: {
        Row: {
          id: string;
          type: CustomizationType;
          label: string;
          price_modifier: number;
          calories_modifier: number;
          protein_modifier: number;
          carbs_modifier: number;
          fats_modifier: number;
          fiber_modifier: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: CustomizationType;
          label: string;
          price_modifier?: number;
          calories_modifier?: number;
          protein_modifier?: number;
          carbs_modifier?: number;
          fats_modifier?: number;
          fiber_modifier?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: CustomizationType;
          label?: string;
          price_modifier?: number;
          calories_modifier?: number;
          protein_modifier?: number;
          carbs_modifier?: number;
          fats_modifier?: number;
          fiber_modifier?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: OrderStatus;
          fulfillment_type: FulfillmentType;
          delivery_address: string | null;
          delivery_phone: string | null;
          payment_method: PaymentMethod | null;
          subtotal: number;
          delivery_fee: number;
          total: number;
          estimated_time: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          delivered_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          status?: OrderStatus;
          fulfillment_type: FulfillmentType;
          delivery_address?: string | null;
          delivery_phone?: string | null;
          payment_method?: PaymentMethod | null;
          subtotal: number;
          delivery_fee?: number;
          total: number;
          estimated_time?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          delivered_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          status?: OrderStatus;
          fulfillment_type?: FulfillmentType;
          delivery_address?: string | null;
          delivery_phone?: string | null;
          payment_method?: PaymentMethod | null;
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          estimated_time?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          delivered_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          name: string;
          price: number;
          quantity: number;
          calories: number | null;
          protein: number | null;
          carbs: number | null;
          fats: number | null;
          fiber: number | null;
          customized_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          name: string;
          price: number;
          quantity?: number;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fats?: number | null;
          fiber?: number | null;
          customized_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          name?: string;
          price?: number;
          quantity?: number;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fats?: number | null;
          fiber?: number | null;
          customized_price?: number;
          created_at?: string;
        };
      };
      order_item_customizations: {
        Row: {
          id: string;
          order_item_id: string;
          customization_rule_id: string | null;
          type: string;
          label: string;
          price_modifier: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_item_id: string;
          customization_rule_id?: string | null;
          type: string;
          label: string;
          price_modifier?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_item_id?: string;
          customization_rule_id?: string | null;
          type?: string;
          label?: string;
          price_modifier?: number;
          created_at?: string;
        };
      };
      cart_sessions: {
        Row: {
          id: string;
          user_id: string;
          menu_item_id: string;
          quantity: number;
          calories: number | null;
          protein: number | null;
          carbs: number | null;
          fats: number | null;
          fiber: number | null;
          customized_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          menu_item_id: string;
          quantity?: number;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fats?: number | null;
          fiber?: number | null;
          customized_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          menu_item_id?: string;
          quantity?: number;
          calories?: number | null;
          protein?: number | null;
          carbs?: number | null;
          fats?: number | null;
          fiber?: number | null;
          customized_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_customizations: {
        Row: {
          id: string;
          cart_session_id: string;
          customization_rule_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_session_id: string;
          customization_rule_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cart_session_id?: string;
          customization_rule_id?: string;
          created_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: ChallengeType;
          points: number;
          icon: string | null;
          target_value: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type: ChallengeType;
          points: number;
          icon?: string | null;
          target_value?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: ChallengeType;
          points?: number;
          icon?: string | null;
          target_value?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      user_challenges: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          current_progress: number;
          is_completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
          current_progress?: number;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          current_progress?: number;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
