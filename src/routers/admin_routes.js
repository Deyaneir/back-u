import { Router } from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser
} from "../controllers/usuario_ontroller.js";

import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup
} from "../controllers/controller_grupos.js";


const router = Router();

/* ===== USUARIOS ===== */
router.get("/users", auth, isAdmin, getAllUsers);
router.put("/users/:id", auth, isAdmin, updateUser);
router.delete("/users/:id", auth, isAdmin, deleteUser);

/* ===== GRUPOS ===== */
router.get("/groups", auth, isAdmin, getGroups);
router.post("/groups", auth, isAdmin, createGroup);
router.put("/groups/:id", auth, isAdmin, updateGroup);
router.delete("/groups/:id", auth, isAdmin, deleteGroup);

export default router;
