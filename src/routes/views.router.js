import { Router } from "express";
import ProductModel from "../Dao/mongoManager/models/productModel.js";
import { authorizationRol, authorizationStrategy } from "../utils.js";
import passport from "passport";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const router = Router();

//vistas de session
function auth(req, res, next) {
  if (req.user) return res.redirect("/");
  return next();
}
// Perfil de usuario
function profile(req, res, next) {
  if (req.user) return next();
  return res.redirect("/login");
}

//Iniciar sesión
router.get("/login", auth, (req, res) => {
  res.render("login", {});
});

//Reestablecer Pass
router.get("/resetPass", auth, (req, res) => {
  res.render("resetPass", {});
});

//Reestablecer Pass
router.get("/resetPassError", auth, (req, res) => {
  res.render("resetPassError", {});
});

// Reestablecer Pass confirm
router.get("/resetPassConfirm", auth, (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, config.secret_jwt);
    const isExpired = Date.now() > decoded.exp * 1000;
    if (isExpired) {
      res.render("resetPassError", { message: "El enlace ha expirado" });
    } else {
      res.render("resetPassConfirm", { token });
    }
  } catch (error) {
    res.render("resetPassError", { message: "Error al verificar el enlace" });
  }
});

//Registro
router.get("/register", auth, (req, res) => {
  res.render("register", {});
});

//Perfil
router.get("/profile", profile, (req, res) => {
  const user = req.user;
  res.render("profile", user);
});

//Perfil admin // user: admin@coder.com // contraseña: 1234
//Perfil Premium // user: premium@coder.com // contraseña: 1234

//Ruta para admins
router.get(
  "/admin",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Premium", "Admin"]),
  (req, res) => {
    res.render("admin", {});
  }
);

//Iniciar session Github
router.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

//Chat socket io
router.get(
  "/messages",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Usuario"),
  (req, res) => {
    res.render("messages", {});
  }
);

router.get(
  "/cart",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "Premium"]),
  (req, res) => {
    res.render("cart", {});
  }
);

//Ruta HOME
router.get("/", async (req, res) => res.render("home", {}));

//Contacto
router.get("/contacto", async (req, res) => res.render("contacto", {}));


//Ruta PAGINATE PRODUCTS
router.get("/productos", async (req, res) => {
  const page = parseInt(req.query?.page || 1);
  const limit = parseInt(req.query?.limit || 10);

  const queryParams = req.query?.query || "";
  const query = {};

  if (queryParams) {
    const [field, value] = queryParams.split(",");
    if (!isNaN(parseInt(value))) {
      query[field] = value;
    }
  }

  const sortField = req.query?.sortField || "createdAt";
  const sortOrder = req.query?.sortOrder === "desc" ? -1 : 1;

  try {
    const products = await ProductModel.paginate(query, {
      limit,
      page,
      lean: true,
      sort: { [sortField]: sortOrder },
    });

    products.prevLink = products.hasPrevPage
      ? `/productos?page=${products.prevPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";
    products.nextLink = products.hasNextPage
      ? `/productos?page=${products.nextPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";

    return res.render("paginate", products);
  } catch (error) {
    return res.status(500).send("Error al enviar products.");
  }
});
//127.0.0.1:8080/?page=&limit=7&sortField=price&sortOrder=desc

export default router;