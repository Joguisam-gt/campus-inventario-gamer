export const validateProductInput = (data) => {
    const errors = [];

    if (!data.name || typeof data.name !== 'string') {
        errors.push('El nombre es requerido y debe ser texto.');
    }
    if (!data.price || typeof data.price !== 'number' || data.price < 0) {
        errors.push('El precio debe ser un número mayor o igual a 0.');
    }
    if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0)) {
        errors.push('El stock debe ser un número entero mayor o igual a 0.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};