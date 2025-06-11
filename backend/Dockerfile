FROM node:20-alpine

WORKDIR /app

# Copiamos solo los archivos necesarios primero
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto de los archivos
COPY . .

# Compilamos el proyecto
RUN npm run build

# Exponemos el puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]