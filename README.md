# Inventario Gamer Campus

Aplicación de consola para administrar el inventario de productos gamer de un campus (periféricos, laptops, componentes, monitores, audio y streaming). Permite registrar, consultar, actualizar y desactivar productos guardados en MongoDB. Fue desarrollada para el personal encargado del control de equipos del campus.

<!-- Reemplaza o elimina las tecnologías que no utilices -->

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## Tecnologías utilizadas

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

- *Lenguaje principal:* JavaScript (ES Modules)
- *Entorno de ejecución:* Node.js 20.19.0 o superior
- *Base de datos:* MongoDB (driver nativo `mongodb` 7.x)
- *Variables de entorno:* dotenv
- *Interfaz:* consola (módulo `readline` de Node.js)
- *Control de versiones:* Git y GitHub
- *Otras herramientas:* nodemon (desarrollo)

---

# Cómo montar el proyecto

## Requisitos previos

Antes de instalar el proyecto, asegúrate de tener instaladas las siguientes herramientas:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) versión 20.19.0 o superior
- [MongoDB](https://www.mongodb.com/try/download/community) en ejecución (local o MongoDB Atlas)
- Editor de código, por ejemplo Visual Studio Code

Puedes comprobar las versiones instaladas con los siguientes comandos:

```bash
git --version
node --version
npm --version
```

## 1. Clonar el repositorio

```bash
git clone https://github.com/Joguisam-gt/campus-inventario-gamer.git
```

## 2. Entrar a la carpeta del proyecto

```bash
cd campus-inventario-gamer
```

## 3. Instalar las dependencias

```bash
npm install
```

## 4. Configurar las variables de entorno

Crea un archivo llamado `.env` en la raíz del proyecto, tomando como referencia `.env.example`:

```bash
cp .env.example .env
```

Contenido de referencia:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/?directConnection=true
DB_NAME=inventario-gamer
COLLECTION_NAME=products
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB. | `mongodb://127.0.0.1:27017/?directConnection=true` |
| `DB_NAME` | Nombre de la base de datos. | `inventario-gamer` |
| `COLLECTION_NAME` | Nombre de la colección de productos. | `products` |

No compartas la URI con credenciales ni subas el archivo `.env` a GitHub.

## 5. Poblar la base de datos (seed)

```bash
npm run seed
```

El script pide confirmación antes de borrar los productos existentes. Para ejecutarlo sin confirmación:

```bash
node src/seed/seedProducts.js --force
```

## 6. Ejecutar el proyecto

Para iniciar en modo normal:

```bash
npm start
```

Para iniciar en modo desarrollo (reinicia la aplicación al detectar cambios):

```bash
npm run dev
```

---

# Estructura del proyecto

```text
campus-inventario-gamer/
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Archivos excluidos de Git
├── package.json              # Dependencias, scripts y versión de Node.js
├── README.md                 # Documentación principal
├── evidencias/
│   └── resultados.md         # Salidas de ejecución para evidencia
└── src/
    ├── index.js              # Punto de entrada y menú interactivo
    ├── config/
    │   └── database.js       # Conexión a MongoDB
    ├── models/
    │   └── Product.js        # Categorías, estados y constructor del documento
    ├── services/
    │   └── product.service.js# Reglas de negocio y operaciones CRUD
    ├── seed/
    │   └── seedProducts.js   # Carga de datos de ejemplo
    └── utils/
        ├── errors.js         # Errores propios de la aplicación
        └── validators.js     # Validación y normalización de entradas
```

## Descripción de carpetas importantes

| Carpeta | Descripción |
|---|---|
| `src/` | Código fuente de la aplicación. |
| `src/config/` | Configuración de la conexión a la base de datos. |
| `src/models/` | Constantes del dominio y estructura de los productos. |
| `src/services/` | Lógica de negocio. No depende de la consola. |
| `src/utils/` | Funciones puras de validación y errores. |
| `src/seed/` | Scripts de carga de datos. |
| `evidencias/` | Evidencias de ejecución del proyecto. |

---

# Documentación del proyecto

## Descripción general

La aplicación se ejecuta en la terminal y muestra un menú con seis operaciones. Toda entrada se valida antes de llegar a la base de datos: los precios y el stock deben ser números válidos, las categorías y los estados deben pertenecer a sus listas permitidas, y los IDs deben tener el formato de MongoDB.

## Objetivo general

Facilitar el registro y control del inventario de productos gamer del campus mediante una herramienta de consola respaldada por MongoDB.

## Objetivos específicos

- Registrar productos con categoría, marca, stock, precio, estado y tags.
- Consultar el inventario completo o filtrado por categoría y estado.
- Actualizar el stock y el precio de un producto.
- Desactivar productos mediante borrado lógico, sin eliminarlos de la base de datos.
- Poblar la base de datos con datos de ejemplo para pruebas.

## Funcionalidades

El sistema permite realizar las siguientes acciones:

- Registrar un producto nuevo.
- Listar todos los productos en una tabla.
- Filtrar productos por categoría y/o estado.
- Buscar un producto por su ID.
- Actualizar el stock y/o el precio de un producto.
- Desactivar un producto (borrado lógico, con confirmación).

## Usuarios del sistema

| Tipo de usuario | Permisos |
|---|---|
| Administrador de inventario | Puede ejecutar todas las operaciones del menú y el script de seed. |

No existe autenticación en la versión actual.

## Flujo principal

1. El usuario inicia la aplicación con `npm start`.
2. La aplicación se conecta a MongoDB con los datos de `.env`.
3. El usuario elige una opción del menú.
4. La aplicación valida los datos ingresados.
5. Si los datos son válidos, la operación se ejecuta sobre la colección de productos.
6. El resultado se muestra en consola. Al elegir `0`, la aplicación cierra la conexión y termina.

## Arquitectura

La aplicación está organizada en capas:

- **Consola (`src/index.js`):** muestra el menú, pide los datos y presenta los resultados.
- **Servicio (`src/services/product.service.js`):** valida los datos, aplica las reglas de negocio y ejecuta las operaciones sobre la colección.
- **Validación (`src/utils/validators.js`):** funciones puras que convierten y validan textos. No acceden a la base de datos.
- **Modelo (`src/models/Product.js`):** define las categorías, los estados permitidos y la forma del documento.
- **Infraestructura (`src/config/database.js`):** administra la conexión a MongoDB.

La capa de servicio recibe la base de datos como parámetro y no depende de la consola, por lo que puede reutilizarse desde otro punto de entrada (por ejemplo, un servidor HTTP).

## Modelo de datos

### Colección: `products`

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | ObjectId | Identificador único generado por MongoDB. |
| `name` | String | Nombre del producto. Obligatorio. |
| `category` | String | Una de: `perifericos`, `laptops`, `componentes`, `monitores`, `audio`, `streaming`. |
| `brand` | String | Marca del producto. Opcional. |
| `stock` | Number (entero) | Cantidad disponible. Mayor o igual a 0. |
| `price` | Number | Precio con hasta dos decimales. Mayor o igual a 0. |
| `status` | String | Una de: `available`, `loaned`, `maintenance`, `inactive`. |
| `tags` | Array de String | Etiquetas en minúsculas. |
| `createdAt` | Date | Fecha de creación. |
| `updatedAt` | Date | Fecha de la última modificación. |

El esquema de referencia para validación nativa de MongoDB está en `src/models/Product.js`, pero no se aplica automáticamente para no afectar colecciones existentes.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias. |
| `npm run seed` | Reemplaza los productos por datos de ejemplo (pide confirmación). |
| `npm start` | Inicia la aplicación. |
| `npm run dev` | Inicia la aplicación con recarga automática. |

## Pruebas

En la versión actual no hay pruebas automatizadas. Las validaciones pueden verificarse de forma aislada importando `src/utils/validators.js`, ya que no dependen de MongoDB.

Pruebas recomendadas para una siguiente versión:

- Validación de precio, stock, categoría, estado, tags e IDs.
- Operaciones CRUD contra una base de datos de pruebas.
- Caso de ID inexistente y de ID con formato inválido.

## Convenciones de código

- Nombres de variables y funciones en `camelCase`.
- Constantes globales en `UPPER_SNAKE_CASE`.
- Cada función y bloque importante tiene un comentario breve que indica su propósito.
- Los errores de validación se lanzan como `ValidationError` y los de búsqueda como `NotFoundError`.

## Convención de commits

```text
feat: agregar registro de productos
fix: corregir validación del precio
docs: actualizar documentación
refactor: reorganizar servicio de productos
```

## Problemas conocidos

- `seed` borra la colección antes de insertar los datos nuevos. Si la inserción falla después del borrado, la colección queda vacía. Usar transacciones requiere un replica set de MongoDB.
- Los precios se guardan como números de punto flotante, no como `Decimal128`. Para inventarios con montos fiscales conviene migrar a `Decimal128`.
- No hay autenticación: cualquier persona con acceso a la consola y a la base de datos puede modificar el inventario.
- Las pruebas automatizadas aún no están implementadas.
- La salida de ejecución en `evidencias/resultados.md` debe completarse con capturas de una ejecución real.

## Mejoras futuras

- Agregar pruebas automatizadas para validadores y servicios.
- Aplicar el esquema de validación nativa de MongoDB en una migración controlada.
- Migrar los precios a `Decimal128`.
- Exponer el servicio mediante una API HTTP reutilizando la capa de servicio.
- Registrar un historial de cambios de stock y precio.

## Cómo contribuir

1. Crea una rama desde `main`:

```bash
git checkout -b feature/nombre-funcionalidad
```

2. Realiza los cambios y verifica que la aplicación funcione con `npm start`.
3. Guarda los cambios con un mensaje descriptivo:

```bash
git commit -m "feat: agregar nueva funcionalidad"
```

4. Envía la rama a GitHub y crea un Pull Request:

```bash
git push origin feature/nombre-funcionalidad
```

## Autor

- *GitHub:* [https://github.com/Joguisam-gt](https://github.com/Joguisam-gt)

## Licencia

Este proyecto fue desarrollado con fines educativos. [Indica aquí la licencia utilizada, por ejemplo MIT, o elimina esta sección si no aplica.]
