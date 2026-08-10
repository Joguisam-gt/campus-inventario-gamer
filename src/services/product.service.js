import { ObjectId } from 'mongodb';
import { getDb } from '../config/database.js';
import { createProductDocument } from '../models/Product.js';
import { validateProductInput } from '../utils/validators.js';

export class ProductService {
    // Acceso a la coleccion de MongoDB nativo
    static get collection() {
        return getDb().collection('products');
    }

    static async getAllProducts(filter = {}) {
        return await this.collection.find(filter).toArray();
    }

    static async getProductById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    static async createProduct(productData) {
        const validation = validateProductInput(productData);
        if (!validation.isValid) {
            throw new Error(`Validacion fallida: ${validation.errors.join(', ')}`);
        }

        const document = createProductDocument(productData);
        const result = await this.collection.insertOne(document);

        return { _id: result.insertedId, ...document };
    }

    static async updateStock(id, newStock) {
        if (newStock < 0) throw new Error('El stock no puede ser negativo.');

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    stock: Number(newStock),
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );

        return result;
    }

    static async deleteProduct(id) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}