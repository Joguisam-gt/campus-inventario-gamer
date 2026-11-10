// Capa de servicio: concentra las reglas de negocio y las operaciones CRUD sobre la coleccion de productos.
// Recibe la base de datos como parametro y no depende de la consola ni de Express.
import { ObjectId } from 'mongodb';
import { ALLOWED_STATUSES, createProductDocument, getCollectionName } from '../models/Product.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
    parseCategory,
    parseEnum,
    parseObjectId,
    parseOptionalText,
    parsePrice,
    parseRequiredText,
    parseStatus,
    parseStock,
    parseTags,
} from '../utils/validators.js';

// Devuelve la coleccion de productos de la base de datos indicada.
const productsCollection = (db) => db.collection(getCollectionName());

// Convierte un ID de texto validado en un ObjectId de MongoDB.
const toObjectId = (id) => new ObjectId(parseObjectId(id));

// Valida y normaliza los datos de un producto nuevo. El stock en blanco se toma como 0.
const sanitizeNewProduct = (data) => ({
    name: parseRequiredText(data.name, 'El nombre'),
    category: parseCategory(data.category),
    brand: parseOptionalText(data.brand),
    stock: parseStock(data.stock, 0),
    price: parsePrice(data.price),
    status: parseStatus(data.status),
    tags: parseTags(data.tags),
});

// Registra un producto nuevo y devuelve el documento insertado junto con su _id.
export const createProduct = async (db, productData) => {
    const document = createProductDocument(sanitizeNewProduct(productData));
    const result = await productsCollection(db).insertOne(document);
    return { _id: result.insertedId, ...document };
};

// Lista productos. Los filtros de categoria y estado se validan antes de consultar la base de datos.
export const listProducts = async (db, filters = {}) => {
    const query = {};
    if (filters.category) {
        query.category = parseCategory(filters.category);
    }
    if (filters.status) {
        query.status = parseEnum(filters.status, ALLOWED_STATUSES, 'El estado');
    }
    return productsCollection(db).find(query).toArray();
};

// Busca un producto por su ID. Lanza NotFoundError si no existe.
export const findProductById = async (db, id) => {
    const product = await productsCollection(db).findOne({ _id: toObjectId(id) });
    if (!product) {
        throw new NotFoundError(`No se encontró el producto con ID: ${id}`);
    }
    return product;
};

// Actualiza stock y/o precio de un producto. Solo estos dos campos son modificables; cualquier otro se ignora.
export const updateProduct = async (db, id, changes = {}) => {
    const objectId = toObjectId(id);
    const updates = {};

    if (changes.stock !== undefined) {
        updates.stock = parseStock(changes.stock);
    }
    if (changes.price !== undefined) {
        updates.price = parsePrice(changes.price);
    }
    if (Object.keys(updates).length === 0) {
        throw new ValidationError('Debe indicar al menos un campo a actualizar (stock o precio).');
    }
    updates.updatedAt = new Date();

    const result = await productsCollection(db).findOneAndUpdate(
        { _id: objectId },
        { $set: updates },
        { returnDocument: 'after' }
    );
    if (!result) {
        throw new NotFoundError(`No se pudo actualizar. Producto no encontrado con ID: ${id}`);
    }
    return result;
};

// Realiza la eliminacion logica del producto marcando su estado como 'inactive'.
export const deactivateProduct = async (db, id) => {
    const result = await productsCollection(db).findOneAndUpdate(
        { _id: toObjectId(id) },
        { $set: { status: 'inactive', updatedAt: new Date() } },
        { returnDocument: 'after' }
    );
    if (!result) {
        throw new NotFoundError(`No se pudo desactivar. Producto no encontrado con ID: ${id}`);
    }
    return result;
};
