# Imagen de Node para construir y correr React
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Usamos --host para que Vite permita conexiones desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]