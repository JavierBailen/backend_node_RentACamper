API REST para la gestión de furgonetas, reservas, valoraciones y favoritos de la plataforma RentACamper.

### 1. Clonar el Repositorio

```bash
git clone <https://github.com/JavierBailen/backend_laravel_RentACamper.git>
cd backend_laravel_RentACamper
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto:

```bash
touch .env
```

Añade las siguientes variables al archivo `.env`:

```env
# Puerto del servidor
PORT=3000

# Base de datos MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=rentacamper
DB_PORT=3306



# Email (Resend)
RESEND_API_KEY=re_tu_clave_de_resend

# URLs de servicios
LARAVEL_API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:4200

# Geocodificación (OpenCage)
OPENCAGE_API_KEY=tu_clave_de_opencage

```


### 4. Configurar Base de Datos

#### Crear Base de Datos MySQL

```sql
CREATE DATABASE rentacamper;
USE rentacamper;
```

#### Crear Tablas

El proyecto utiliza la misma base de datos que Laravel. Asegúrate de que las siguientes tablas existan (se crean automáticamente desde Laravel):

- `users`
- `furgonetas`
- `reservas`
- `valoracion`
- `favorito`

Si Laravel no está configurado, puedes crear las tablas manualmente:



### 5. Configurar Conexión a Base de Datos

Edita el archivo `src/database/mysql.js` si necesitas cambiar la configuración:

```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',      
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'rentacamper',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
```



### 6. Verificar Configuración de CORS

El archivo `src/index.js` tiene configurado CORS para:
- Frontend Angular: `http://localhost:4200`
- Backend Laravel: `http://localhost:8000`

Si necesitas cambiar estos puertos, edita el array `origin` en `corsOptions`.



### 7. Iniciar el Servidor

#### Modo Desarrollo (con Nodemon)

```bash
npm run dev
```


El servidor estará disponible en: `http://localhost:3000`

##  Configuración de Servicios Externos

### Resend (Emails)

1. Regístrate en [Resend](https://resend.com)
2. Obtén tu API key
3. Añádela al archivo `.env`:

```env
RESEND_API_KEY=re_tu_clave_aqui
```

### OpenCage (Geocodificación)

1. Regístrate en [OpenCage](https://opencagedata.com)
2. Obtén tu API key
3. Añádela al archivo `.env`:

```env
OPENCAGE_API_KEY=tu_clave_aqui
```