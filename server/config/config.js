// ==========================
// Puerto
// ==========================


process.env.PORT = process.env.PORT || 3000;

// ==========================
// Entorno
// ==========================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Base de datos 
// ==========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {

    urlDB = 'mongodb+srv://catomas:trucha1998@cluster0-5uco4.mongodb.net/Cafe'
}

process.env.URLDB = urlDB;