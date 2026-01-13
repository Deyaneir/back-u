import express from 'express';
const router = express.Router();
import * as grupoController from '../controllers/controller_grupos.js';

// Rutas para la gestión de grupos
router.get('/listar', grupoController.listarGrupos);
router.post('/crear', grupoController.crearGrupo);
router.delete('/:id', grupoController.eliminarGrupo);

// Rutas de interacción
router.post('/:id/unirse', grupoController.unirseGrupo);
router.post('/:id/abandonar', grupoController.abandonarGrupo);

// Rutas de contenido (Muro)
router.post('/:id/post', grupoController.crearPost);

// ✅ ESTA ES LA LÍNEA CLAVE QUE FALTA O ESTÁ MAL:
export default router;
