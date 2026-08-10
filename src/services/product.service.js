import { Product } from '../models/Product.js';
import { validateProductInput } from '../utils/validators.js';

export class ProductService {
    static async getAllProducts(filter = {}) {
        return await Product.find(filter);
    }

    static async getProductById(id) {
        return await Product.findById(id);
    }

    static async createProduct(productData) {
        const validation = validateProductInput(productData);
        if (!validation.isValid) {
            throw new Error(`Validacion fallida: ${validation.errors.join(', ')}`);
        }
        return await Product.create(productData);
    }
    static async updateStock(id, newStock) {
        if (newStock < 0) throw new Error('El stock no puede ser negativo.');
        return await Product.findByIdAnUpdate(
            id,
            { stock: newStock },
            { new: true, runValidators: true }
        );
    }

    static async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}