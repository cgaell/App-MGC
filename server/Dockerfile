# Usamos una imagen ligera de Node.js
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias para aprovechar el caché
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código (server.js, logs, etc.)
COPY . .

# Exponemos el puerto que configuraste (3000)
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["node", "server.js"]