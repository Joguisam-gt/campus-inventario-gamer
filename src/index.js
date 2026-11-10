// Punto de entrada: menu interactivo por consola para gestionar el inventario de productos.
import 'dotenv/config';
import * as readline from 'readline/promises';
import { connectDB, disconnectDB } from './config/database.js';
import { ALLOWED_CATEGORIES, ALLOWED_STATUSES, DEFAULT_STATUS, DEFAULT_TAGS } from './models/Product.js';
import {
    createProduct,
    listProducts,
    findProductById,
    updateProduct,
    deactivateProduct,
} from './services/product.service.js';

// Interfaz de lectura y escritura en la consola.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Marca si el cierre ya comenzo, para evitar cerrar la conexion dos veces.
let shuttingDown = false;

// Cierra la interfaz de consola y la conexion a MongoDB. Es seguro llamarla varias veces.
const shutdown = async () => {
    if (shuttingDown) {
        return;
    }
    shuttingDown = true;
    rl.close();
    await disconnectDB();
};

// Si la entrada termina (por ejemplo Ctrl+D), inicia el cierre ordenado.
rl.on('close', () => {
    shutdown();
});

// Formatea un precio numerico como moneda con dos decimales.
const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

// Convierte una lista de productos en filas legibles para console.table.
const toTableRows = (products) =>
    products.map((product) => ({
        Nombre: product.name,
        Categoría: product.category,
        Marca: product.brand || 'N/A',
        Stock: product.stock,
        Precio: formatPrice(product.price),
        Estado: product.status,
    }));

// Imprime en consola el detalle completo de un producto.
const printProductDetails = (product) => {
    console.log(`Nombre: ${product.name}`);
    console.log(`Categoría: ${product.category}`);
    console.log(`Marca: ${product.brand || 'N/A'}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Precio: ${formatPrice(product.price)}`);
    console.log(`Estado: ${product.status}`);
    if (product.tags && product.tags.length > 0) {
        console.log(`Tags: ${product.tags.join(', ')}`);
    }
};

// Imprime una tabla de productos, o un aviso si la lista esta vacia.
const printProductTable = (products, emptyMessage) => {
    if (products.length === 0) {
        console.log(emptyMessage);
        return;
    }
    console.table(toTableRows(products));
};

// Muestra el menu principal y devuelve la opcion escrita por el usuario.
const showMenu = async () => {
    console.log('\n====================== INVENTARIO GAMER CAMPUS ======================');
    console.log('1. Registrar producto');
    console.log('2. Listar todos los productos');
    console.log('3. Buscar por categoría o estado');
    console.log('4. Buscar producto por ID');
    console.log('5. Actualizar cantidad / precio');
    console.log('6. Desactivar producto (Borrado Lógico)');
    console.log('0. Salir');
    console.log('=====================================================================');
    const option = await rl.question('-> ¿Qué desea hacer?: ');
    return option.trim();
};

// Solicita los datos de un producto nuevo y lo registra.
const handleCreateProduct = async (db) => {
    console.log('\n======> REGISTRAR PRODUCTO <======');
    const name = await rl.question('Nombre del producto: ');
    const category = await rl.question(`Categoría (${ALLOWED_CATEGORIES.join(', ')}): `);
    const brand = await rl.question('Marca (opcional): ');
    const stock = await rl.question('Stock inicial [Default: 0]: ');
    const price = await rl.question('Precio: ');
    const status = await rl.question(`Estado (${ALLOWED_STATUSES.join(', ')}) [Default: ${DEFAULT_STATUS}]: `);
    const tags = await rl.question(`Tags separados por coma [Default: ${DEFAULT_TAGS.join(', ')}]: `);

    const product = await createProduct(db, { name, category, brand, stock, price, status, tags });

    console.log('\nProducto registrado con éxito');
    printProductDetails(product);
};

// Muestra todos los productos registrados.
const handleListAll = async (db) => {
    console.log('\n======> LISTA GENERAL DE INVENTARIO <======');
    const products = await listProducts(db);
    printProductTable(products, '--> No hay productos registrados.');
};

// Muestra los productos filtrados por categoria y/o estado. Los campos en blanco no filtran.
const handleFilterProducts = async (db) => {
    console.log('\n======> BÚSQUEDA FILTRADA <======');
    const category = await rl.question('Categoría a filtrar (dejar en blanco para omitir): ');
    const status = await rl.question('Estado a filtrar (dejar en blanco para omitir): ');

    const filters = {};
    if (category.trim()) {
        filters.category = category.trim();
    }
    if (status.trim()) {
        filters.status = status.trim();
    }

    const products = await listProducts(db, filters);
    printProductTable(products, '--> No se encontraron productos con los filtros especificados.');
};

// Busca un producto por ID y muestra su detalle.
const handleFindById = async (db) => {
    console.log('\n======> BUSCAR POR ID <======');
    const id = await rl.question('ID del producto: ');
    const product = await findProductById(db, id.trim());

    console.log('\n--> Producto encontrado:');
    printProductDetails(product);
};

// Actualiza stock y/o precio. Los campos que se dejan en blanco no se modifican.
const handleUpdateProduct = async (db) => {
    console.log('\n======> ACTUALIZAR CANTIDAD / PRECIO <======');
    const id = await rl.question('ID del producto a actualizar: ');
    const stockInput = await rl.question('Nuevo stock (dejar en blanco para omitir): ');
    const priceInput = await rl.question('Nuevo precio (dejar en blanco para omitir): ');

    const changes = {};
    if (stockInput.trim()) {
        changes.stock = stockInput.trim();
    }
    if (priceInput.trim()) {
        changes.price = priceInput.trim();
    }

    const updated = await updateProduct(db, id.trim(), changes);

    console.log('\nProducto actualizado correctamente');
    console.log(`Nombre: ${updated.name}`);
    console.log(`Stock: ${updated.stock}`);
    console.log(`Precio: ${formatPrice(updated.price)}`);
};

// Desactiva un producto (borrado logico) previa confirmacion del usuario.
const handleDeactivateProduct = async (db) => {
    console.log('\n======> DESACTIVAR PRODUCTO (BORRADO LÓGICO) <======');
    const id = await rl.question('ID del producto a desactivar: ');
    const confirmation = await rl.question('¿Confirmar la desactivación? (s/n): ');

    if (confirmation.trim().toLowerCase() !== 's') {
        console.log('Operación cancelada. No se realizaron cambios.');
        return;
    }

    const deactivated = await deactivateProduct(db, id.trim());

    console.log('\nProducto desactivado correctamente');
    console.log(`Nombre: ${deactivated.name}`);
    console.log(`Estado: ${deactivated.status}`);
};

// Ejecuta la accion asociada a la opcion del menu. Devuelve false cuando el usuario decide salir.
const handleOption = async (option, db) => {
    switch (option) {
        case '1':
            await handleCreateProduct(db);
            return true;
        case '2':
            await handleListAll(db);
            return true;
        case '3':
            await handleFilterProducts(db);
            return true;
        case '4':
            await handleFindById(db);
            return true;
        case '5':
            await handleUpdateProduct(db);
            return true;
        case '6':
            await handleDeactivateProduct(db);
            return true;
        case '0':
            console.log('Cerrando aplicación...');
            return false;
        default:
            console.log('Opción no válida. Intente nuevamente.');
            return true;
    }
};

// Bucle principal del menu. Cada error se muestra y el menu vuelve a aparecer.
const runApp = async (db) => {
    let keepRunning = true;
    while (keepRunning && !shuttingDown) {
        try {
            const option = await showMenu();
            keepRunning = await handleOption(option, db);
        } catch (error) {
            if (shuttingDown) {
                break;
            }
            console.error(`\n[Error]: ${error.message}`);
        }
    }
};

// Punto de entrada: conecta a MongoDB, ejecuta el menu y cierra recursos al final.
const main = async () => {
    let db;
    try {
        db = await connectDB();
        console.log('Conexion a MongoDB establecida exitosamente');
    } catch (error) {
        console.error(`[Error]: ${error.message}`);
        await shutdown();
        process.exitCode = 1;
        return;
    }

    await runApp(db);
    await shutdown();
};

main();
