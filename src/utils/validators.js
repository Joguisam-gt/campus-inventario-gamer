// Funciones puras de validacion y normalizacion de datos de entrada. No consultan la base de datos
// ni realizan operaciones de entrada/salida.
import {
    ALLOWED_CATEGORIES,
    ALLOWED_STATUSES,
    DEFAULT_STATUS,
    DEFAULT_TAGS,
} from '../models/Product.js';
import { ValidationError } from './errors.js';

// Patron de un ObjectId de MongoDB: exactamente 24 caracteres hexadecimales.
const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

// Convierte cualquier valor en texto sin espacios extremos; nulos e indefinidos quedan como cadena vacia.
const toTrimmedString = (value) => (value === undefined || value === null ? '' : String(value).trim());

// Indica si el valor esta vacio despues de quitar espacios.
const isBlank = (value) => toTrimmedString(value) === '';

// Valida un texto obligatorio y devuelve su version sin espacios extremos.
export const parseRequiredText = (value, fieldLabel) => {
    const text = toTrimmedString(value);
    if (!text) {
        throw new ValidationError(`${fieldLabel} es obligatorio.`);
    }
    return text;
};

// Valida un texto opcional; devuelve cadena vacia cuando no se indica.
export const parseOptionalText = (value) => toTrimmedString(value);

// Valida que el texto pertenezca a la lista permitida, sin distinguir mayusculas; devuelve el valor normalizado.
export const parseEnum = (value, allowedValues, fieldLabel) => {
    const normalized = toTrimmedString(value).toLowerCase();
    if (!allowedValues.includes(normalized)) {
        throw new ValidationError(`${fieldLabel} debe ser uno de: ${allowedValues.join(', ')}.`);
    }
    return normalized;
};

// Valida la categoria del producto contra la lista de categorias permitidas.
export const parseCategory = (value) => parseEnum(value, ALLOWED_CATEGORIES, 'La categoria');

// Valida el estado del producto; si se deja en blanco se usa el estado por defecto.
export const parseStatus = (value) =>
    isBlank(value) ? DEFAULT_STATUS : parseEnum(value, ALLOWED_STATUSES, 'El estado');

// Convierte un texto a numero y valida que sea finito y mayor o igual a cero.
const parseNonNegativeNumber = (value, fieldLabel) => {
    const text = toTrimmedString(value);
    if (text === '') {
        throw new ValidationError(`${fieldLabel} es obligatorio.`);
    }
    const number = Number(text);
    if (!Number.isFinite(number)) {
        throw new ValidationError(`${fieldLabel} debe ser un numero valido.`);
    }
    if (number < 0) {
        throw new ValidationError(`${fieldLabel} no puede ser negativo.`);
    }
    return number;
};

// Valida el precio: numero mayor o igual a cero con un maximo de dos decimales.
export const parsePrice = (value) => {
    const price = parseNonNegativeNumber(value, 'El precio');
    if (Math.round(price * 100) / 100 !== price) {
        throw new ValidationError('El precio admite como maximo dos decimales.');
    }
    return price;
};

// Valida el stock: entero mayor o igual a cero. Si se deja en blanco y se indica defaultValue, se usa ese valor.
export const parseStock = (value, defaultValue) => {
    if (isBlank(value)) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new ValidationError('El stock es obligatorio.');
    }
    const stock = parseNonNegativeNumber(value, 'El stock');
    if (!Number.isInteger(stock)) {
        throw new ValidationError('El stock debe ser un numero entero.');
    }
    return stock;
};

// Convierte una lista de tags (texto separado por comas o arreglo) en tags unicos en minusculas.
// Si no se escribe ninguno, devuelve los tags por defecto.
export const parseTags = (input) => {
    const raw = Array.isArray(input) ? input.join(',') : toTrimmedString(input);
    const tags = [
        ...new Set(
            raw
                .split(',')
                .map((tag) => tag.trim().toLowerCase())
                .filter((tag) => tag.length > 0)
        ),
    ];
    return tags.length > 0 ? tags : [...DEFAULT_TAGS];
};

// Valida que el texto tenga formato de ObjectId de MongoDB y devuelve el texto limpio.
export const parseObjectId = (value) => {
    const text = toTrimmedString(value);
    if (!OBJECT_ID_PATTERN.test(text)) {
        throw new ValidationError('El ID debe tener 24 caracteres hexadecimales.');
    }
    return text;
};
