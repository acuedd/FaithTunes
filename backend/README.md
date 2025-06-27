# 🎵 FaithTunes Backend

Backend de la plataforma **FaithTunes**: sistema de gestión musical con autenticación, subida y reproducción de canciones, playlists, favoritos y funcionalidades de auditoría.

## 📦 Tecnologías principales

- [NestJS](https://nestjs.com/) + TypeScript
- [MySQL](https://www.mysql.com/)
- [Amazon S3](https://aws.amazon.com/s3/) o [MinIO](https://min.io/) para almacenamiento de archivos
- JWT Authentication (access + refresh tokens)
- Docker + Docker Compose
- Swagger para documentación de API
- ESLint + Prettier + Husky + Lint-Staged
- Jest para pruebas unitarias y de integración
- GitHub Actions (CI/CD opcional)

---

## 📁 Estructura del proyecto

```
faithtunes-backend/
├── src/
│   ├── auth/              # Módulo de autenticación
│   ├── songs/             # Módulo de canciones
│   ├── playlists/         # Módulo de playlists
│   ├── users/             # Módulo de usuarios
│   ├── albums/            # Módulo de artistas
│   ├── artist/            # Gestión de workspaces
│   ├── migrations/        # Canales de comunicación
│   ├── shared/            # Utilidades, decoradores, excepciones, constantes
│   ├── storage/           # Servicio de MinIO/S3
│   └── main.ts            # Bootstrap de la app
│   ├── ormconfig.ts/      # Configuración y conexión a MySQL
├── test/                  # Pruebas unitarias e2e
├── .env                   # Variables de entorno
├── Dockerfile             # Dockerfile de la app NestJS
└── README.md              # Este archivo
```

## 🚀 Cómo iniciar el proyecto localmente

### 2. Copiar el archivo .env

```
cp .env.example .env

```

Y completar las variables necesarias, por ejemplo:
```
PORT=3000

DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=faithtunes
DB_NAME=faithtunes_db

JWT_SECRET=mysecret
JWT_EXPIRATION=3600s
JWT_REFRESH_EXPIRATION=7d

S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_BUCKET_NAME=songs

UPLOAD_MAX_FILE_SIZE_MB=50
```
### 3. Levantar los servicios de docker (generales)

```
docker-compose up --build
```

Esto levantará:

	•	API NestJS en http://localhost:3000
	•	MySQL en localhost:3306
	•	MinIO en http://localhost:9000 (admin: minio / minio123)

4. Acceder a la documentación Swagger

http://localhost:3000/api


# 🧪 Ejecutar pruebas

```
# Unit & Integration tests
npm run test

# E2E tests
npm run test:e2e
```


# 🔐 Seguridad y buenas prácticas

	•	Validación global con class-validator
	•	Rate Limiting con Throttler
	•	CORS habilitado por origen específico
	•	Tokens firmados con RSA (opcional)
	•	Authorization por roles y guardias personalizados
	•	Logger global y auditoría de endpoints


# 📈 Cobertura mínima

El proyecto debe mantener una cobertura mínima del 85%. Puedes verificarla con:

```
npm run test:cov
```

# 🛠️ Scripts útiles

```
npm run start:dev       # Desarrollo
npm run start:prod      # Producción
npm run lint            # Lint
npm run format          # Formatear con Prettier
npm run test            # Test unitarios
npm run test:e2e        # Test end-to-end
```


# 📬 Contacto

Desarrollado por Edward Acu López
GitHub: @acuedd
Correo: opcional
Proyecto: FaithTunes 🎶
