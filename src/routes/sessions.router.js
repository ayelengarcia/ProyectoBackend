import { Router } from "express";
import passport from "passport";
import {currentStrategy, authorization} from "../utils.js"
import {
  loginGithub,
  loginLocal,
  logout,
  registerLocal,
} from "../controllers/sessions.controller.js";

const router = Router();

//Register local
router.post("/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  registerLocal
);

//Login local
router.post("/login", passport.authenticate("login"), loginLocal);

// Cerrar sesión
router.get("/logout", logout);

//Iniciar session Github
router.get("/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  loginGithub
);

//ruta datos de usuario - Solo acceso al usuario logueado
router.get("/current", 
currentStrategy("jwt",{ session:false}), 
authorization("Usuario"), (req, res) => {

  res.send({status: "success", payload: req.user })

})

export default router;
