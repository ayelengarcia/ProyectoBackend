import { Router } from "express";
import {
  createUser,
  deletedUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updatedUserById,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/users", createUser);

router.get("/users", getUsers);

router.get("/users/:email", getUserByEmail);

router.get("/users/id/:id", getUserById);

router.put("/users/:id", updatedUserById);

router.delete("/users/:id", deletedUser);

export default router;
