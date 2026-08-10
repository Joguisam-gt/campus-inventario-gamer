// Categorias permitidas en la aplicacion 
export const ALLOWED_CATEGORIES = ['laptops', 'componentes', 'perifericos', 'monitores', 'audio', 'streaming'];

// Funcion constructora para estandarizar la creacion de documentos Products
export const createProductDocument = ({ name, category, price, stock = 0, isActive = true }) => {
    const now = new Date();

    return {
        name: name ? name.trim() : '',
        category,
        price: Number(price),
        stock: Number(stock),
        isActive: Boolean(isActive),
        createdAt: now,
        updatedAt: now,
    };
};

// Esquema JSON Schema para validacion nativa dentro de MongoDB
export const productoCollectionSchema = {
    $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'category', 'price', 'stock', 'isActive'],
        properties: {
            name: {
                bsonType: 'string',
                description: 'El nombre es obligatorio y debe ser un texto',
            },
            category: {
                enum: ALLOWED_CATEGORIES,
                description: 'La categoría debe ser una de las opciones permitidas',
            },
            price: {
                bsonType: ['double', 'int', 'decimal'],
                minimum: 0,
                description: 'El precio debe ser un número mayor o igual a 0',
            },
            stock: {
                bsonType: ['int', 'long'],
                minimum: 0,
                description: 'El stock debe ser un número mayor o igual a 0',
            },
            isActive: {
                bsonType: 'bool',
                description: 'isActive debe ser un booleano',
            },
            createdAt: {
                bsonType: 'date',
            },
            updatedAt: {
                bsonType: 'date',
            },
        },
    }
};