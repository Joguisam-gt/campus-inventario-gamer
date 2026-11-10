// Infraestructura de datos: administra la unica conexion a MongoDB de la aplicacion.
import { MongoClient } from 'mongodb';

// URI por defecto cuando MONGODB_URI no esta definida en el entorno.
const DEFAULT_URI = 'mongodb://127.0.0.1:27017/?directConnection=true';

// Nombre de base de datos por defecto, el mismo que usaba la URI original.
const DEFAULT_DB_NAME = 'inventario-gamer';

// Devuelve la URI de conexion leida del entorno en el momento de la llamada.
const getMongoUri = () => process.env.MONGODB_URI || DEFAULT_URI;

// Devuelve el nombre de la base de datos leido del entorno.
const getDbName = () => process.env.DB_NAME || DEFAULT_DB_NAME;

// Instancias compartidas de cliente y base de datos.
let clientInstance = null;
let dbInstance = null;

// Abre la conexion, verifica que el servidor responda y devuelve la base de datos.
// No termina el proceso: si falla, lanza un error que decide el punto de entrada.
export const connectDB = async () => {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(getMongoUri());
    try {
        await client.connect();
        await client.db('admin').command({ ping: 1 });
    } catch (error) {
        await client.close().catch(() => {});
        throw new Error(`No se pudo conectar a MongoDB: ${error.message}`);
    }

    clientInstance = client;
    dbInstance = client.db(getDbName());
    return dbInstance;
};

// Devuelve la base de datos activa; lanza error si todavia no se llamo a connectDB.
export const getDb = () => {
    if (!dbInstance) {
        throw new Error('La base de datos no ha sido inicializada. Debes ejecutar connectDB() primero.');
    }
    return dbInstance;
};

// Cierra la conexion activa y limpia las referencias compartidas. Es seguro llamarla varias veces.
export const disconnectDB = async () => {
    if (!clientInstance) {
        return;
    }
    await clientInstance.close();
    clientInstance = null;
    dbInstance = null;
};
