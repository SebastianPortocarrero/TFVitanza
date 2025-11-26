/**
 * Mapea errores de Supabase Auth a mensajes en español
 */
export const getAuthErrorMessage = (error: any): string => {
    const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Email o contraseña incorrectos',
        'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión',
        'User already registered': 'Este email ya está registrado',
        'Database error finding user': 'Error de conexión con la base de datos. Por favor intenta de nuevo',
        'User not found': 'No existe una cuenta con este email',
        'Invalid email': 'El formato del email no es válido',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    };

    const errorMessage = error?.message || '';
    return errorMessages[errorMessage] || 'Ocurrió un error inesperado. Por favor intenta de nuevo';
};

/**
 * Maneja errores de red con reintentos automáticos
 */
export const handleNetworkError = async <T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 1000
): Promise<T> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            const isLastRetry = i === retries - 1;

            // Si es el último intento, lanzar el error
            if (isLastRetry) {
                throw error;
            }

            // Solo reintentar en errores de red
            const isNetworkError =
                error.message?.includes('network') ||
                error.message?.includes('fetch') ||
                error.message?.includes('timeout') ||
                error.code === 'ECONNREFUSED';

            if (!isNetworkError) {
                throw error;
            }

            // Esperar antes de reintentar (backoff exponencial)
            await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
        }
    }

    throw new Error('Número máximo de reintentos excedido');
};
