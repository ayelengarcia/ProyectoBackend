import { Router } from "express";
import passport from "passport";
import {
  loginGithub,
  loginLocal,
  logout,
  registerLocal,
} from "../controllers/sessions.controller.js";

const router = Router();

//Register local
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  registerLocal
);

//Login local
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  loginLocal
);

//Iniciar session Github
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  loginGithub
);

// Cerrar sesión
router.get("/logout", logout);

export default router;
