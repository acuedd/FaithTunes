# 🎧 FaithTunes Frontend

Frontend de **FaithTunes**, una plataforma web para gestionar, reproducir y compartir música. Inspirado en la experiencia de usuario de apps como Riffusion o Spotify.

---

## 🌐 Tecnologías principales

- React + TypeScript
- Redux Toolkit + RTK Query / React Query
- React Router DOM
- Mantine UI para componentes y estilos
- Axios para llamadas HTTP
- Diseño responsive y mobile-first
- Player persistente y barra lateral de navegación
- Hooks personalizados para manejar: canciones, playlists, canales, workspaces y usuarios

---

## 📁 Estructura del proyecto
```
faithtunes-frontend/
├── public/
├── src/
│   ├── components/         # Componentes reutilizabl (SongCard, SongPlayer, Sidebar, etc.)
│   ├── hooks/              # Hooks personalizados (useSongs, useWorkspaces, useAuth…)
│   ├── pages/              # Páginas principales (Home, Login, Playlists, Workspace…)
│   ├── services/           # Lógica de conexión con API (song.service.ts, auth.service.ts…)
│   ├── store/              # Redux slices (songSlice, userSlice, workspaceSlice, etc.)
│   ├── types/              # Tipado global de entidades (Song, Playlist, Workspace, etc.)
│   ├── utils/              # Utilidades generales (formateadores, helpers, etc.)
│   ├── App.tsx             # Componente raíz
│   └── main.tsx            # Punto de entrada
├── .env                    # Variables de entorno
├── package.json
├── tailwind.config.js
└── README.md
```


## 🧪 Requisitos

- Node.js 18+
- NPM 9+ o Yarn 1.x

---

## 🚀 Iniciar el proyecto localmente

### 1. Instalar dependencias

```
npm install
# o
yarn
```

### 3. Copiar y configurar el archivo .env

```
cp .env.example .env
```

Ejemplo:

```
VITE_API_URL=http://localhost:3000
VITE_S3_BASE_URL=http://localhost:9000/son
```


# 🔐 Funcionalidades clave
	•	🔑 Autenticación con JWT
	•	🎵 Subida y reproducción de canciones (.mp3)
	•	✅ Control de autorización de canciones
	•	📂 Playlists personalizadas
	•	🔁 Sección de recientes, nuevas y más reproducidas
	•	🧑 Administración de usuarios
	•	📱 Responsive para vista mobile (diseño tipo tarjeta)
	•	🎚️ Controles de reproducción persistentes
	•	🌙 Modo oscuro por defecto


  # 🛠️ Scripts útiles
  ```
  npm run dev           # Levanta en desarrollo
  npm run build         # Compila para producción
  npm run preview       # Previsualiza build
  npm run lint          # Lint del proyecto
  npm run format
```


# 📬 Contacto

Desarrollado por Edward Acu López

GitHub: @acuedd

Proyecto: FaithTunes 🎵