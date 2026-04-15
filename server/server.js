require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const writeLog = (message, type = "INFO") => {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const logEntry = `[${timestamp}] ${type}: ${message}\n`;
    fs.appendFileSync(path.join(logDir, 'app.log'), logEntry);
    console.log(logEntry);
};

// CONEXIÓN
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => writeLog("Conexión exitosa a MongoDB"))
    .catch(err => writeLog("Fallo en conexión: " + err.message, "ERROR"));

app.listen(process.env.PORT || 3000, () => {
    writeLog("Servidor iniciado");
});