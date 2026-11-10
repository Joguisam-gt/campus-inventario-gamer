// Errores propios de la aplicacion. Sus mensajes estan redactados para mostrarse al usuario.

// Error lanzado cuando un dato de entrada no cumple las reglas de validacion.
export class ValidationError extends Error {
    // Crea el error con un mensaje legible para el usuario.
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Error lanzado cuando el producto solicitado no existe en la base de datos.
export class NotFoundError extends Error {
    // Crea el error con el mensaje indicado.
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
