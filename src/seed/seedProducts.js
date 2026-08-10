import { connectDB, disconnectDB } from '../config/database.js';

const COLLECTION_NAME = process.env.COLLECTION_NAME || 'products';

const initialProducts = [
    {
        name: 'Teclado mecánico RedSwitch',
        category: 'periferico',
        brand: 'HyperX',
        stock: 12,
        price: 475.50,
        status: 'available',
        tags: ['gamer', 'torneo', 'clase'],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Mouse Gamer Logitech G502',
        category: 'periferico',
        brand: 'Logitech',
        stock: 15,
        price: 350.00,
        status: 'available',
        tags: ['gamer', 'torneo'],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Laptop Gamer Legion 5 Pro',
        category: 'laptop',
        brand: 'Lenovo',
        stock: 5,
        price: 8500.00,
        status: 'available',
        tags: ['clase', 'torneo'],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Audífonos Razer BlackShark V2',
        category: 'audio',
        brand: 'Razer',
        stock: 8,
        price: 620.00,
        status: 'loaned',
        tags: ['gamer', 'clase'],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: 'Kit de Streaming Elgato Stream Deck',
        category: 'streaming',
        brand: 'Elgato',
        stock: 3,
        price: 1200.00,
        status: 'maintenance',
        tags: ['torneo', 'clase'],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

async function seed() {
    try {
        const db = await connectDB();
        const collection = db.collection(COLLECTION_NAME);

        await collection.deleteMany({});
        console.log('[Seed] Colección limpiada con éxito.');

        const result = await collection.insertMany(initialProducts);
        console.log(`[Seed] ${result.insertedCount} productos insertados correctamente.`);
    } catch (err) {
        console.error(`[Seed Error]: ${err.message}`);
    } finally {
        await disconnectDB();
        process.exit(0);
    }
}

seed();