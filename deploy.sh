#!/bin/bash

echo "Iniciando despliegue de la aplicación..."

docker compose down

echo "Construyendo la imagen de Docker..."

docker compose up --build -d

docker ps

echo "Despliegue completado. La aplicación está en ejecución. Accede a http://localhost:5173 para ver la aplicación."
