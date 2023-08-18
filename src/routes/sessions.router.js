import { Router } from "express";
import UserModel from "../Dao/mongoManager/models/userModel.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email, password });

  if (!user) return res.redirect("/login");

  req.session.user = user;

  console.log(`${user.first_name} acaba de iniciar sesión`);

  if (user.roles === "Admin") {
    return res.redirect("/admin"); // Redirige a la vista de administrador si es un admin
  } else {
    return res.redirect("/profile"); // Redirige al perfil si no es un admin
  }
});


router.post("/register", async (req, res) => {
  const user = req.body;
  await UserModel.create(user);

  return res.redirect("/login");
});

// Cerrar sesión
router.get("/logout", (req, res) => {
  if (req.session.user) {
    console.log(`${req.session.user.first_name} acaba de cerrar sesión`);
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al cerrar sesión:", err);
      }
      res.redirect("/login");
    });
  }
});

export default router;
