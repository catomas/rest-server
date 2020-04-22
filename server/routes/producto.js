const express = require('express');

const _ = require('underscore');

const { verificaToken } = require('../middlewares/authentication')

let app = express();

let Producto = require('../models/producto');

// ==========================
// obtener productos
// ==========================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('usuario categoria nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });


        });

});

// ==========================
// obtener un productos por ID
// ==========================
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        })

    // populate: usuario categoria
});

// =========================
// BUscar Productos
// =========================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })

})

// ==========================
// Crear un nuevo producto
// ==========================
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id

    })

    producto.save((err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ==========================
// Actualizar un nuevo producto
// ==========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // Actualizar 
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'usuario', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {

                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    })

});

// ==========================
// Eliminar producto
// ==========================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBorrado) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!productoBorrado) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        };


        res.json({
            ok: true,
            producto: productoBorrado
        });

    });
});

module.exports = app;