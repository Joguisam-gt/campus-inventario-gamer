// Script de poblamiento: reemplaza el contenido de la coleccion de productos por datos de ejemplo.
// Uso: npm run seed (pide confirmacion) o node src/seed/seedProducts.js --force (sin confirmacion).
import 'dotenv/config';
import * as readline from 'readline/promises';
import { connectDB, disconnectDB } from '../config/database.js';
import { createProductDocument, getCollectionName } from '../models/Product.js';

// Datos de ejemplo del inventario inicial.
const SAMPLE_PRODUCTS = [
    {
        name: 'Teclado mecánico RedSwitch',
        category: 'perifericos',
        brand: 'HyperX',
        stock: 12,
        price: 475.5,
        status: 'available',
        tags: ['gamer', 'torneo', 'clase'],
    },
    {
        name: 'Mouse Gamer Logitech G502',
        category: 'perifericos',
        brand: 'Logitech',
        stock: 15,
        price: 350.0,
        status: 'available',
        tags: ['gamer', 'torneo'],
    },
    {
        name: 'Laptop Gamer Legion 5 Pro',
        category: 'laptops',
        brand: 'Lenovo',
        stock: 5,
        price: 8500.0,
        status: 'available',
        tags: ['clase', 'torneo'],
    },
    {
        name: 'Audífonos Razer BlackShark V2',
        category: 'audio',
        brand: 'Razer',
        stock: 8,
        price: 620.0,
        status: 'loaned',
        tags: ['gamer', 'clase'],
    },
    {
        name: 'Kit de Streaming Elgato Stream Deck',
        category: 'streaming',
        brand: 'Elgato',
        stock: 3,
        price: 1200.0,
        status: 'maintenance',
        tags: ['torneo', 'clase'],
    },
];

// Pide confirmacion explicita antes de borrar los datos existentes. Solo acepta "si".
const confirmReset = async (collectionName) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
        const answer = await rl.question(
            `Esto eliminará todos los documentos de la colección "${collectionName}". Escriba "si" para continuar: `
        );
        return answer.trim().toLowerCase() === 'si';
    } finally {
        rl.close();
    }
};

// Limpia la coleccion e inserta los datos de ejemplo. Devuelve el codigo de salida del proceso.
const runSeed = async () => {
    const collectionName = getCollectionName();
    const forced = process.argv.includes('--force');

    if (!forced && !(await confirmReset(collectionName))) {
        console.log('[Seed] Operación cancelada. No se modificó la base de datos.');
        return 0;
    }

    const db = await connectDB();
    const collection = db.collection(collectionName);

    const deleted = await collection.deleteMany({});
    console.log(`[Seed] Colección limpiada: ${deleted.deletedCount} documentos eliminados.`);

    const documents = SAMPLE_PRODUCTS.map((product) => createProductDocument(product));
    const inserted = await collection.insertMany(documents);
    console.log(`[Seed] ${inserted.insertedCount} productos insertados correctamente.`);
    return 0;
};

// Punto de entrada: ejecuta el seed, cierra la conexion y termina con el codigo de salida correcto.
const main = async () => {
    let exitCode = 1;
    try {
        exitCode = await runSeed();
    } catch (error) {
        console.error(`[Seed Error]: ${error.message}`);
    } finally {
        await disconnectDB();
    }
    process.exit(exitCode);
};

main();
