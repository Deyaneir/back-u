const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/controller_grupos');

// Rutas para la gestión de grupos
router.get('/listar', grupoController.listarGrupos);
router.post('/crear', grupoController.crearGrupo);
router.delete('/:id', grupoController.eliminarGrupo);

// Rutas de interacción
router.post('/:id/unirse', grupoController.unirseGrupo);
router.post('/:id/abandonar', grupoController.abandonarGrupo);

// Rutas de contenido (Muro)
router.post('/:id/post', grupoController.crearPost);

module.exports = router;
