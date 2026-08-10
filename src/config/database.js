import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'campus_inventory_gamer';

export const client = new MongoClient(uri);


// Conecta al cliente nativo de MongoDB y retorna la instancia de la base de datos.

export async function connectDB() {
    try {
        await client.connect();
        console.log(`[Database] Conectado exitosamente a MongoDB: ${dbName}`);
        return client.db(dbName);
    } catch (error) {
        console.error(`[Database Error] Error al conectar a MongoDB: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Cierra la conexión del cliente MongoDB.
 */
export async function disconnectDB() {
    try {
        await client.close();
        console.log('[Database] Conexión a MongoDB cerrada correctamente.');
    } catch (error) {
        console.error(`[Database Error] Error al cerrar conexión: ${error.message}`);
    }
}