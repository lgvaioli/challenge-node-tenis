# Nodus Tenis Challenge

## Deploy

Se asume que el usuario tiene instalado [Docker](https://www.docker.com/) y [Node](https://nodejs.org/en/).

### Linux

En el directorio raíz del proyecto, ejecutar `./run.sh`

Este script instala y ejecuta el proyecto.

En la primera ejecución, la aplicación pedirá ingresar en una URL y copiar-pegar un código, para generar
un token de acceso a la API de Google. En ejecuciones subsecuentes este paso se saltea.

### Windows

La instalación en Windows debe realizarse manualmente, siguiendo los siguientes pasos:

1. En el directorio raíz del proyecto, ejecutar `npm install`

2. En el directorio `backend`, ejecutar `node generate_token.js` (este paso genera el token de acceso y es
necesario solamente en la primera ejecución)

3. En el directorio raíz del proyecto, ejecutar `docker-compose up`

Para ejecuciones subsecuentes, solo hace falta ejecutar el paso 3, i.e. `docker-compose up`