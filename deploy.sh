#!/bin/bash

echo "Iniciando despliegue de la aplicación..."

docker-compose down

echo "Construyendo la imagen de Docker..."

DOCKER_BUILDKIT=0 docker-compose up --build -d

docker ps

echo "Despliegue completado. La aplicación está en ejecución."
