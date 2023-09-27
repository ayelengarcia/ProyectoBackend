import { Router } from "express";
import ProductModel from "../Dao/mongoManager/models/productModel.js";
import passport from "passport";

const router = Router();

//vistas de session
function auth(req, res, next) {
  if(req.user) return res.redirect("/")
  return next()
}
// Perfil de usuario
function profile(req, res, next) {
  if(req.user) return next()
  return res.redirect("/login")
}

const renderLogin = (req, res) => {
  res.render("login", {})
}
const renderRegister = (req, res) => {
  res.render("register", {})
}
const renderProfile = (req, res) => {
  const user = req.user
  res.render("profile", user)
}


//Ruta principal
router.get("/", (req, res) => res.render("index", {}));

//Iniciar sesión
router.get("/login", auth, renderLogin);

//Registro
router.get("/register", auth, renderRegister);

//Perfil
router.get("/profile", profile, renderProfile);

//Iniciar session Github
router.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

//Perfil admin (CHEQUEAR NO FUNCIONA)
// user: admincoder@coder.com
// contraseña: 1234
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user;

    if (user.roles === "Admin") {
      res.render("admin", user);
    } else {
      res.status(403).send("Acceso denegado para usuarios no administradores");
    }
  }
);

// PAGINATE
router.get("/products/paginate", async (req, res) => {
  const page = parseInt(req.query?.page || 1);
  const limit = parseInt(req.query?.limit || 3);

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
      ? `/products/paginate/?page=${products.prevPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";
    products.nextLink = products.hasNextPage
      ? `/products/paginate/?page=${products.nextPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";

    return res.render("paginate", products);
  } catch (error) {
    return res.status(500).send("Error al enviar products.");
  }
});
//127.0.0.1:8080/products/paginate/?page=&limit=7&sortField=price&sortOrder=desc

//Chat socket io
router.get("/messages", (req, res) => {
  res.render("messages", {});
});

// Productos Real-times
// router.get("/products", async (req, res) => {
//   const products = await producto.getProducts();

//   res.render("products", { products });
// });


export default router;
