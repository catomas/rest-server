require('./config/config.js')

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

mongoose.set('useFindAndModify', false);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Configuracion global de rutas 
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {

    if (err) throw err;
    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log("Escucnado el puerto ", process.env.PORT);
});