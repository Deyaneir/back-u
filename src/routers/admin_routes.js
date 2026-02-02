import { Router } from "express";
import * as grupoController from "../controllers/controller_grupos.js";
import {
  getAllUsers,
  updateUser,
  deleteUser
} from "../controllers/usuario_controller.js";

const router = Router();

/* ===== USUARIOS ===== */
router.get("/users", auth, isAdmin, getAllUsers);
router.put("/users/:id", auth, isAdmin, updateUser);
router.delete("/users/:id", auth, isAdmin, deleteUser);

/* ===== GRUPOS ===== */
router.get("/groups", auth, isAdmin, grupoController.listarGrupos);
router.post("/groups", auth, isAdmin, grupoController.crearGrupo);
router.delete("/groups/:id", auth, isAdmin, grupoController.eliminarGrupo);

export default router;
