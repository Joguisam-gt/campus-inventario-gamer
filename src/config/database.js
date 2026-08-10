import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario-gamer';
let dbInstance = null;

export const connectDB = async () => {
  if (dbInstance) return dbInstance;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    dbInstance = client.db();
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