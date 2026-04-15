Qué onda, este es el repo de mi proyecto de DevOps. Es una web app que mezcla **React** con un backend en **Node.js**.

### ¿Qué tiene el proyecto?
* **Frontend:** Una landing page pro hecha con React y Vite.
* **Backend:** Un servidor en Node.js que se encarga de la "magia" (rutas y conexión).
* **Base de Datos:** Uso MongoDB Atlas para guardar la info en la nube.
* **Logs de auditoría:** Cada que pasa algo importante, el server lo anota solito en `/server/logs/app.log`.

---

### 📂 Estructura rápida
* `/src`: Todo el código visual de React.
* `/server`: Mi servidor de Node.
* `/server/logs`: Donde se guardan los archivos .log que pidió el profe.

---

### Cómo correrlo
1. **El Server:** Entra a `cd server`, dale `npm install` y luego `node server.js`.
2. **La Web:** En la carpeta principal dale `npm run dev`.

### Datos Clave
* **Variables de entorno:** Uso un archivo `.env` para no quemar mis claves de la base de datos (seguridad ante todo).
* **Git Flow:** Trabajé con ramas (`feature branches`) para no romper nada mientras programaba el servidor.

