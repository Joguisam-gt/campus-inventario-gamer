<div align="center">

# Campus Backend — Product Management Architecture

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Layered_--_Service_Layer-blue?style=for-the-badge)]()
[![SOLID](https://img.shields.io/badge/Principles-SOLID_Compliant-orange?style=for-the-badge)]()

<p align="center">
  <b>Solucion backend modular de grado profesional construida sobre Node.js y MongoDB. Aplica un enfoque estricto de Arquitectura en Capas, Patron Service Layer y la implementacion completa de los 5 Principios SOLID.</b>
</p>

[Caracteristicas Clave](#caracteristicas-clave) •
[Arquitectura del Sistema](#arquitectura-del-sistema) •
[Justificacion de Principios SOLID](#justificacion-de-principios-solid) •
[Estructuracion del Proyecto](#estructuracion-del-proyecto) •
[Flujo de Funcionamiento](#flujo-de-funcionamiento) •
[Estrategia de Git Flow y Commits](#estrategia-de-git-flow-y-commits) •
[Guia de Instalacion y Uso](#guia-de-instalacion-y-uso)

</div>

---

## Caracteristicas Clave

* **Cero Acoplamiento a Frameworks Web:** Logica de negocio 100% aislada e independiente de HTTP/Express, ejecutable de manera nativa por consola para maxima flexibilidad.
* **Service Layer Pattern:** Encapsulamiento total de las operaciones comerciales e interacciones con la base de datos dentro de servicios dedicados.
* **Data Validation Engine:** Modulo independiente con funciones puras para validacion estricta de esquemas y sanitizacion previa a la persistencia.
* **Automated Seeding System:** Script para el reabastecimiento, migracion y limpieza controlada de datos de prueba en MongoDB.
* **Documentacion y Evidencias:** Reporte tecnico de ejecucion y salida de terminal estructurada para auditoria tecnica.

---

## Arquitectura del Sistema

El proyecto esta disenado bajo una **Arquitectura en Capas (Layered Architecture)** optimizada con la abstraccion de una **Capa de Servicio (Service Layer)**.

### Justificacion del Patron Elegido

1. **Aislamiento de Logica de Negocio:** Al separar la persistencia de datos (Mongoose) de los scripts ejecutables (`index.js`), la logica de negocio reside exclusivamente en `product.service.js`.
2. **Alta Reusabilidad:** Cualquier punto de entrada futuro (servidor HTTP, interfaz CLI, microservicio o worker en segundo plano) consumira el servicio sin duplicar una sola linea de codigo.
3. **Mantenibilidad y Testabilidad:** Modificar reglas comerciales (limites de stock, margenes de precio, descuentos) requiere intervenir un solo modulo, minimizando riesgos de regresion.

```text
┌─────────────────────────────────────────────────────────────┐
│              Capa de Ejecucion / Consola                    │
│            (src/index.js & src/seed/seedProducts.js)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Invocacion de metodos de servicio
┌──────────────────────────────▼──────────────────────────────┐
│           Capa de Servicios (Service Layer)                 │
│              src/services/product.service.js                │
└──────────────┬──────────────────────────────┬───────────────┘
               │ Valida payloads              │ Persiste / Consulta
┌──────────────▼──────────────┐  ┌────────────▼───────────────┐
│     Capa de Utilidades      │  │     Capa de Dominio/ORM     │
│   src/utils/validators.js   │  │    src/models/Product.js    │
└─────────────────────────────┘  └────────────┬───────────────┘
                                              │ Establece Conexion
                                 ┌────────────▼───────────────┐
                                 │   Infraestructura / BD     │
                                 │    src/config/database.js  │
                                 └────────────────────────────┘
```
## Justificacion de Principios SOLID

La arquitectura del proyecto fue disenada para cumplir rigurosamente con cada uno de los 5 principios SOLID:

### 1. Single Responsability Principal(SRO) - Resposabilidad unica

Cada archivo del sistema posee un proposito delimitado y libre de responsabilidades cruzadas:

* `src/config/database.js`: Unicamente gestiona el ciclo de vida y eventos de la conexion a MongoDB.

* `src/models/Product.js`: Define exclusivamente la estructura del documento y las restrucciones del ORM/ODM.

* `src/utils/validators.js`: Continene funciones puras de validacion. No realiza consultas a base de datos ni maneja I/O/

* `src/services/product.service.js`: Encapsula las opciones CRUD y reglas de negocio sin preocuparse de como se muestran los datos al usuario.

### 2. Open/closed principal (OCP) - Abierto/Cerrado

* La clase `ProductService` permite extender sus capacidades (por ejemplo, agregando filtros avanzados por categoria o logica de calculo de impuestos) mediante la adicion de nuevos metodos sin necesidad de alternar los metodos CRUD ya testeados.

### 3. Liskov Substitution Principal (LSP) - Sustitucio de Liskov

* Todas las operaciones de respuesta en la capa de servicios devuelven esttructuras de datos homogeneas e invariantes (`object`/`array` estandarizados.)

* Los errores lanzados por validadores y servicios heredan de tipos estandarizados, lo que garantiza que la capa de ejecucion (`index.js`) puedan manejar cualquier fallo de forma polimorfica sin romper el flujo.

### 4. Interface Segregation Principle (ISP) - Segregacion de interfaces

* Aunque JavaScript no posee interfaces nativas, el diseno segrega las utilidades en modulos pequenos y especializados.

* El validador (`validators.js`) expone funciones atomica e independientes( `validatePrice`, `validateStock`), permitiendo que otros componentes usen solo la validacion que requieren.

### 5. Dependency Inversion Principle (DIP) - Inversion de Dependencias

* El punto de entrada principal (`src/index.js`) no se acopla a la implementacion concreta del driver de base de datos ni a consultas directas de mongoDB.

* Toda interaccion con los datos se realiza a traves de la abstraccion de `ProductService`, lo que permitiria migrar la fuente de persistencia (por ejemplo, de MongoDB a PostgreSQL o Redis) cambiando el servicio interno sin modificar el script cliente.

## Estructuracion del proyecto 

Organizacion modular disenafa bajo el principio de Separacion de responsabilidades 

```text
campus-inventario-gamer/
├── .env.example              # Plantilla de variables de entorno (Sin credenciales expuestas)
├── .gitignore                # Reglas de exclusion para Git (node_modules, .env, logs)
├── package.json              # Manifiesto de dependencias, scripts npm y metadatos
├── README.md                 # Documentacion tecnica principal del repositorio
│
├── evidencias/
│   └── resultados.md         # Capturas, tablas de salida de terminal y logs de prueba
│
└── src/
    ├── index.js              # Punto de entrada principal (Orquestacion de la ejecucion)
    │
    ├── config/
    │   └── database.js       # Configuracion de infraestructura y conexion con MongoDB
    │
    ├── models/
    │   └── Product.js        # Esquema de datos Mongoose y tipos de dominio
    │
    ├── services/
    │   └── product.service.js# Capa de Servicio (Logica de negocio comercial)
    │
    ├── seed/
    │   └── seedProducts.js   # Script de poblamiento y reseteo automatizado de BD
    │
    └── utils/
        └── validators.js     # Motores de validacion pura de payloads de entrada
```

## Flujo de funcionamiento

```text
[Inicio] ──► Carga variables de entorno (.env)
   │
   ├──► Establece conexion con MongoDB (src/config/database.js)
   │
   ├──► Recibe/Procesa datos del catalogo
   │       │
   │       ├──► Pasa por validadores puros (src/utils/validators.js)
   │       │
   │       └──► Procesa operacion en BD via Service Layer (src/services/product.service.js)
   │
   └──► Imprime resultados en consola con formato de tabla (src/index.js)
```

## Estrategia de Git flow y commits

| Rama | Tipo | Mensaje de Commit |
| :--- | :--- | :--- |
| `feature/set-up-and-config` | `feat(setup)` | `initialize project structure and database configuration` |
| `feature/models-and-validators` | `feat(models)` | `define Product schema and input validation utilities` |
| `feature/product-service` | `feat(services)` | `implement ProductService layer for business logic` |
| `feature/seed-and-execution` | `feat(execution)` | `add database seeding script and main entry point` |
| `feature/docs-and-evidence` | `docs(evidencias)` | `add portfolio-grade README and execution evidence` |

## Guia de instalacion y uso

### Prerrequisitos

* **Node.js:** Version 20.0.0 o superior
* **MongoDB:** Instancia local ejecutandose en el puerto default `27017` o una URI de MongoDB Atlas.

### Pasos de configuracion

#### 1. Clonar el repositorio:
```text
git clone https://github.com/Joguisam-gt/campus-inventario-gamer.git
cd campus-inventario-gamer
```

#### 2. Instalar dependencias 
```text
npm install
```
#### 3. Configurar variables de entorno:
```text
cp .env.example .env
```
#### 4. Poblar la base de datos (Seeding):
```text
npm run seed
```
#### 5. Ejecutar la aplicacion
```text
# Ejecucion estandar:
npm start

# modo desarrollo (nodemon):
npm run dev
```
