import { Router } from "express";
import passport from "passport";
import {
  authorizationRol,
  authorizationStrategy,
  extractNonSensitiveUserInfo,
} from "../utils.js";
import {
  loginGithub,
  loginLocal,
  logout,
  registerLocal,
  resetPassword,
} from "../controllers/sessions.controller.js";

const router = Router();

//Register local
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  registerLocal
);

//Login local
router.post("/login", passport.authenticate("login"), loginLocal);

//Iniciar session Github
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  loginGithub
);

// Cerrar sesión
router.get("/logout", logout);

//Reset pass
router.post("/resetPassConfirm", resetPassword);

//ruta datos de usuario logueado - Admin
router.get(
  "/current",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Admin"),
  (req, res) => {
    res.send({ status: "success", payload: req.user });
  }
);

//ruta datos de usuario - Informacion no sensible
router.get(
  "/currentUser",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "Admin", "Premium"]),
  extractNonSensitiveUserInfo,
  (req, res) => {
    if (req.nonSensitiveUserInfo) {
      res.send({ status: "success", payload: req.nonSensitiveUserInfo });
    } else {
      res.status(401).send({ error: "No autorizado" });
    }
  }
);

export default router;
