import * as readline from 'readline/promises';
import { connectDB, disconnectDB } from './config/database.js';
import {
    createProduct,
    listProducts,
    findProductById,
    updateProduct,
    deactivateProduct
} from './services/product.service.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function menu(db) {
    console.log('\n====================== INVENTARIO GAMER CAMPUS ======================');
    console.log('1. Registrar producto');
    console.log('2. Listar todos los productos');
    console.log('3. Buscar por categoría o estado');
    console.log('4. Buscar producto por ID');
    console.log('5. Actualizar cantidad / precio');
    console.log('6. Desactivar producto (Borrado Lógico)');
    console.log('0. Salir');
    console.log('=====================================================================');

    const opt = await rl.question('-> ¿Qué desea hacer?: ');

    try {
        switch (opt) {
            case '1': await handleCreateProduct(db); break;
            case '2': await handleListAll(db); break;
            case '3': await handleFilterProducts(db); break;
            case '4': await handleFindById(db); break;
            case '5': await handleUpdateProduct(db); break;
            case '6': await handleDeactivateProduct(db); break;
            case '0':
                console.log('Cerrando aplicación...');
                rl.close();
                await disconnectDB();
                process.exit(0);
            default:
                console.log('Opción no válida. Intente nuevamente.');
                await menu(db);
                break;
        }
    } catch (error) {
        console.error(`\n[Error]: ${error.message}`);
        await menu(db);
    }
}

async function handleCreateProduct(db) {
    console.log('\n======> REGISTRAR PRODUCTO <======');
    const name = await rl.question('Nombre del producto: ');
    const category = await rl.question('Categoría (perifericos, laptops, componentes, monitores, audio, streaming): ');
    const brand = await rl.question('Marca: ');
    const stock = await rl.question('Stock inicial: ');
    const price = await rl.question('Precio: ');
    const status = await rl.question('Estado (available, loaned, maintenance, inactive) [Default: available]: ');
    const tagsInput = await rl.question('Tags (separados por coma): ');

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['gamer', 'clase'];

    const product = await createProduct(db, {
        name,
        category,
        brand,
        stock,
        price,
        status: status || 'available',
        tags
    });

    console.log('\nProducto registrado con éxito');
    console.log(`Nombre: ${product.name}`);
    console.log(`Categoría: ${product.category}`);
    console.log(`Marca: ${product.brand}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Precio: $${Number(product.price).toFixed(2)}`);
    console.log(`Estado: ${product.status}`);
    console.log(`Tags: ${product.tags.join(', ')}`);

    await menu(db);
}

async function handleListAll(db) {
    console.log('\n======> LISTA GENERAL DE INVENTARIO <======');
    const products = await listProducts(db);
    if (products.length === 0) {
        console.log('--> No hay productos registrados.');
    } else {
        console.table(products.map(p => ({
            Nombre: p.name,
            Categoría: p.category,
            Marca: p.brand || 'N/A',
            Stock: p.stock,
            Precio: `$${Number(p.price).toFixed(2)}`,
            Estado: p.status
        })));
    }
    await menu(db);
}

async function handleFilterProducts(db) {
    console.log('\n======> BÚSQUEDA FILTRADA <======');
    const category = await rl.question('Categoría a filtrar (dejar en blanco para omitir): ');
    const status = await rl.question('Estado a filtrar (dejar en blanco para omitir): ');

    const filters = {};
    if (category.trim()) filters.category = category.trim();
    if (status.trim()) filters.status = status.trim();

    const products = await listProducts(db, filters);
    if (products.length === 0) {
        console.log('--> No se encontraron productos con los filtros especificados.');
    } else {
        console.table(products.map(p => ({
            Nombre: p.name,
            Categoría: p.category,
            Marca: p.brand || 'N/A',
            Stock: p.stock,
            Precio: `$${Number(p.price).toFixed(2)}`,
            Estado: p.status
        })));
    }
    await menu(db);
}

async function handleFindById(db) {
    console.log('\n======> BUSCAR POR ID <======');
    const id = await rl.question('ID del producto: ');
    const product = await findProductById(db, id);

    console.log('\n--> Producto encontrado:');
    console.log(`Nombre: ${product.name}`);
    console.log(`Categoría: ${product.category}`);
    console.log(`Marca: ${product.brand || 'N/A'}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Precio: $${Number(product.price).toFixed(2)}`);
    console.log(`Estado: ${product.status}`);
    if (product.tags && product.tags.length > 0) {
        console.log(`Tags: ${product.tags.join(', ')}`);
    }

    await menu(db);
}

async function handleUpdateProduct(db) {
    console.log('\n======> ACTUALIZAR CANTIDAD / PRECIO <======');
    const id = await rl.question('ID del producto a actualizar: ');
    const stockStr = await rl.question('Nuevo stock (dejar en blanco para omitir): ');
    const priceStr = await rl.question('Nuevo precio (dejar en blanco para omitir): ');

    const updateData = {};
    if (stockStr.trim()) updateData.stock = stockStr.trim();
    if (priceStr.trim()) updateData.price = priceStr.trim();

    const updated = await updateProduct(db, id, updateData);

    console.log('\nProducto actualizado correctamente');
    console.log(`Nombre: ${updated.name}`);
    console.log(`Stock: ${updated.stock}`);
    console.log(`Precio: $${Number(updated.price).toFixed(2)}`);

    await menu(db);
}

async function handleDeactivateProduct(db) {
    console.log('\n======> DESACTIVAR PRODUCTO (BORRADO LÓGICO) <======');
    const id = await rl.question('ID del producto a desactivar: ');
    const deactivated = await deactivateProduct(db, id);

    console.log('\nProducto desactivado correctamente');
    console.log(`Nombre: ${deactivated.name}`);
    console.log(`Estado: ${deactivated.status}`);

    await menu(db);
}

async function main() {
    try {
        const db = await connectDB();
        await menu(db);
    } catch (err) {
        console.error('Error al iniciar la aplicación: ', err);
        rl.close();
        await disconnectDB();
    }
}

main();