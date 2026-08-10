import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario-gamer';
let dbInstance = null;
let clientInstance = null;

export const connectDB = async () => {
    if (dbInstance) return dbInstance;

    try {
        clientInstance = new MongoClient(uri);
        await clientInstance.connect();
        dbInstance = clientInstance.db();
        console.log('Conexion a MongoDB establecida exitosamente');
        return dbInstance;
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
};

export const getDb = () => {
    if (!dbInstance) {
        throw new Error('La base de datos no ha sido inicializada. Debes ejecutar connectDB() primero.');
    }
    return dbInstance;
};

export const disconnectDB = async () => {
    if (clientInstance) {
        await clientInstance.close();
        clientInstance = null;
        dbInstance = null;
        console.log('Conexion a MongoDB cerrada correctamente');
    }
};