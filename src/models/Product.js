// Modelo de dominio de Producto: constantes permitidas, valores por defecto y constructor del documento.

// Categorias permitidas para clasificar un producto del inventario.
export const ALLOWED_CATEGORIES = Object.freeze([
    'perifericos',
    'laptops',
    'componentes',
    'monitores',
    'audio',
    'streaming',
]);

// Estados permitidos. 'inactive' es el resultado de la eliminacion logica.
export const ALLOWED_STATUSES = Object.freeze(['available', 'loaned', 'maintenance', 'inactive']);

// Estado asignado a un producto nuevo cuando el usuario no indica uno.
export const DEFAULT_STATUS = 'available';

// Tags asignados a un producto nuevo cuando el usuario no escribe ninguno.
export const DEFAULT_TAGS = Object.freeze(['gamer', 'clase']);

// Devuelve el nombre de la coleccion: usa COLLECTION_NAME del entorno o 'products' por defecto.
export const getCollectionName = () => process.env.COLLECTION_NAME || 'products';

// Construye el documento que se guarda en MongoDB agregando las fechas de creacion y actualizacion.
export const createProductDocument = ({ name, category, brand, stock, price, status, tags }) => {
    const now = new Date();
    return { name, category, brand, stock, price, status, tags, createdAt: now, updatedAt: now };
};

// Esquema JSON de referencia para validacion nativa en MongoDB. No se aplica automaticamente
// para no afectar colecciones existentes.
export const productCollectionSchema = {
    $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'category', 'price', 'stock', 'status', 'tags', 'createdAt', 'updatedAt'],
        properties: {
            name: { bsonType: 'string', minLength: 1 },
            category: { enum: ALLOWED_CATEGORIES },
            brand: { bsonType: 'string' },
            price: { bsonType: ['double', 'int', 'long', 'decimal'], minimum: 0 },
            stock: { bsonType: ['int', 'long'], minimum: 0 },
            status: { enum: ALLOWED_STATUSES },
            tags: { bsonType: 'array', items: { bsonType: 'string' } },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
        },
    },
};
