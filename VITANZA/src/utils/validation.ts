// Utilidades de validación para formularios

export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    PHONE_REGEX: /^(\+51)?[9]\d{8}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): boolean => {
    return VALIDATION.EMAIL_REGEX.test(email.trim());
};

/**
 * Valida formato de teléfono peruano
 * Acepta: +51999888777, 999888777, +51 999 888 777
 */
export const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, '');
    return VALIDATION.PHONE_REGEX.test(cleanPhone);
};

/**
 * Valida contraseña robusta
 * Retorna objeto con validez y lista de errores
 */
export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        errors.push(`Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`);
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Al menos un número');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string, fieldName: string): string => {
    return value.trim() ? '' : `${fieldName} es requerido`;
};

/**
 * Formatea número de teléfono peruano
 * 999888777 -> +51 999 888 777
 */
export const formatPhone = (phone: string): string => {
    const cleanPhone = phone.replace(/\s/g, '').replace('+51', '');
    if (cleanPhone.length === 9) {
        return `+51 ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
    }
    return phone;
};
