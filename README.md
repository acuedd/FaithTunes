# FaithTunes

FaithTunes es una aplicación de música y biblioteca musical que permite cargar, listar, reproducir y gestionar canciones, playlists y artistas. Incluye autenticación, roles de usuario, favoritos, auditoría y una interfaz similar a Riffusion.

## Tecnologías

- **Backend**: NestJS + TypeScript
- **Base de datos**: MySQL (con TypeORM)
- **Almacenamiento de archivos**: MinIO/S3 (para MP3)
- **Autenticación**: JWT
- **Documentación**: Swagger (OpenAPI)
- **Testing**:
  - Unitarias e Integración: Jest + Supertest
  - E2E: Cypress
- **Frontend**: React + Vite + TypeScript
  - Gestión de estado: Redux + custom hooks
  - UI: Mantine (o librería de componentes)
- **Contenedores**: Docker + Docker Compose
- **CI/CD (opcional)**: GitHub Actions

## Requisitos previos

- Git
- Docker (v20+)
- Docker Compose
- Node.js (v18+ para desarrollo local)
- npm o yarn

## Estructura del proyecto
```
/ (raíz)
├─ docker-compose.yml         # Orquesta de contenedores: backend, frontend, db, minio
├─ README.md                 # Este archivo
├─ frontend/                 # Código del cliente
│  └─ README.md              # Guía específica de frontend
└─ backend/                  # Código del servidor
└─ README.md              # Guía específica de backend
```

## Levantando el proyecto con Docker Compose

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/faithtunes.git
   cd faithtunes
    ```

2. Copia el ejemplo de variables de entorno para el backend:

```
cp backend/.env.example backend/.env
```

Ajusta las variables (DB_HOST, DB_PORT, DB_USER, DB_PASS, JWT_SECRET, etc.) si es necesario.

3. Arranca todos los servicios:

``` 
docker-compose up -d
```

4. Ejecuta las migraciones del backend:

``` 
docker-compose exec backend npm run migration:run
```

5. Accede a:

* Frontend: http://localhost:3000

* Backend API: http://localhost:4000/api

* Swagger: http://localhost:4000/api/docs

6. Para detener y limpiar:

``` 
docker-compose down
``` 
