import { ObjectId } from 'mongodb';

export const createProduct = async (db, productData) => {
    const document = {
        name: productData.name ? productData.name.trim() : '',
        category: productData.category,
        brand: productData.brand,
        stock: Number(productData.stock) || 0,
        price: Number(productData.price) || 0,
        status: productData.status || 'available',
        tags: Array.isArray(productData.tags) ? productData.tags : [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection('products').insertOne(document);
    return { _id: result.insertedId, ...document };
};

export const listProducts = async (db, filters = {}) => {
    return await db.collection('products').find(filters).toArray();
};

export const findProductById = async (db, id) => {
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) {
        throw new Error(`No se encontro el producto con ID: ${id}`);
    }
    return product;
};

export const updateProduct = async (db, id, updateData) => {
    const fieldsToUpdate = { ...updateData, updatedAt: new Date() };

    if (fieldsToUpdate.stock !== undefined) {
        fieldsToUpdate.stock = Number(fieldsToUpdate.stock);
    }
    if (fieldsToUpdate.price !== undefined) {
        fieldsToUpdate.price = Number(fieldsToUpdate.price);
    }

    const result = await db.collection('products').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: fieldsToUpdate },
        { returnDocument: 'after' }
    );

    if (!result) {
        throw new Error(`No se pudo actualizar. Producto no encontrado con ID: ${id}`);
    }
    return result;
};

export const deactivateProduct = async (db, id) => {
    const result = await db.collection('products').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: 'inactive', updatedAt: new Date() } },
        { returnDocument: 'after' }
    );

    if (!result) {
        throw new Error(`No se pudo desactivar. Producto no encontrado con ID: ${id}`);
    }
    return result;
};