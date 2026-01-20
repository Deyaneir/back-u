import express from 'express';
const router = express.Router();

// Importamos todas las funciones del controlador
import * as grupoController from '../controllers/controller_grupos.js';

// Definición de rutas
router.get('/listar', grupoController.listarGrupos);
router.post('/crear', grupoController.crearGrupo);
router.delete('/:id', grupoController.eliminarGrupo);
router.post('/:id/unirse', grupoController.unirseGrupo);
router.post('/:id/abandonar', grupoController.abandonarGrupo);
router.post('/:id/post', grupoController.crearPost);
router.post('/:id/post/:postId/comentar', comentarPost);

// ✅ EXPORTACIÓN POR DEFECTO PARA EL SERVER.JS
export default router;
