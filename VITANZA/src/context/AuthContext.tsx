import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { getAuthErrorMessage } from '../utils/errorHandler';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener o crear el perfil del usuario desde Supabase
  const fetchUserProfile = async (userId: string, forceLogoutOnTimeout: boolean = true): Promise<User | null> => {
    try {
      console.log('📋 Obteniendo perfil para userId:', userId);

      // Intentar obtener el perfil
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('🔍 Resultado de query profiles:', { data, error });

      if (error) {
        console.error('❌ Error al obtener perfil:', error);
        // Si hay error, hacer logout automáticamente
        await supabase.auth.signOut();
        window.location.reload();
        return null;
      }

      // Si no existe el perfil, intentar crearlo
      if (!data) {
        console.log('⚠️ Perfil no existe, intentando crear...');

        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          await supabase.auth.signOut();
          return null;
        }

        const newProfile = {
          id: userId,
          email: authData.user.email || '',
          name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'Usuario',
          role: authData.user.email === 'admin@vitanza.pe' ? 'ADMIN' : 'CLIENTE',
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('❌ Error al crear perfil:', createError);
          // Si no puede crear el perfil, hacer logout
          await supabase.auth.signOut();
          return null;
        }

        console.log('✅ Perfil creado exitosamente');
        return {
          id: createdProfile.id,
          email: createdProfile.email,
          name: createdProfile.name,
          role: createdProfile.role,
          avatar: createdProfile.avatar || undefined,
        };
      }

      console.log('✅ Perfil obtenido correctamente');
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: data.avatar || undefined,
      };
    } catch (err: any) {
      console.error('❌ Error inesperado al obtener perfil:', err);
      // Cualquier error: hacer logout automáticamente para limpiar estado
      await supabase.auth.signOut();
      return null;
    }
  };

  // Escuchar cambios en la sesión de autenticación
  useEffect(() => {
    console.log('🔄 AuthContext iniciando...');
    let mounted = true;

    // Obtener sesión actual con timeout
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error al obtener sesión:', error);
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        console.log('📱 Sesión actual:', session ? 'Existe' : 'No existe');

        if (session?.user && mounted) {
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUser(profile);
            console.log('✅ Usuario cargado en sesión inicial');
          }
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error inesperado en initAuth:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) {
          console.log('✅ AuthContext inicializado, setIsLoading(false)');
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔔 Cambio de autenticación:', _event);

      if (!mounted) return;

      // Solo manejar SIGNED_OUT, ignorar todo lo demás
      // initAuth() ya maneja el load inicial
      // login() maneja el login manual
      if (_event === 'SIGNED_OUT') {
        console.log('👋 Usuario cerró sesión');
        if (mounted) setUser(null);
      }

      // Ignorar SIGNED_IN, TOKEN_REFRESHED, etc para evitar reloads constantes
    });

    return () => {
      console.log('🧹 Limpiando subscription de auth');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Iniciando login para:', email);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Error en signInWithPassword:', error);
        throw error;
      }

      console.log('✅ Login exitoso en auth, obteniendo perfil...');

      if (!data.user) {
        throw new Error('No se obtuvo información del usuario');
      }

      const profile = await fetchUserProfile(data.user.id);
      console.log('✅ Perfil obtenido:', profile);
      setUser(profile);

    } catch (error: any) {
      console.error('❌ Error en login:', error);
      throw new Error(getAuthErrorMessage(error));
    } finally {
      console.log('🏁 Login finalizado, setIsLoading(false)');
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // El trigger handle_new_user() creará el perfil automáticamente
        // Esperamos un momento para que se ejecute el trigger
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const profile = await fetchUserProfile(data.user.id);
        setUser(profile);
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
