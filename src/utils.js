import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker/locale/es";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./config/config.js";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPass = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  return jwt.sign({ user }, config.secret_jwt, { expiresIn: "24h" });
};

export const extractCookie = (req) => {
  return req && req.cookies ? req.cookies[config.secret_cookie] : null;
};

export const authorizationStrategy = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({
          error: info.messages ? info.messages : info.toString(),
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorizationRol = (validRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).send({ error: "No autorizado" });

    if (validRoles.includes(user.user.roles)) {
      next();
    } else {
      res.status(403).send({ error: "Usuario no autorizado" });
    }
  };
};

export const extractNonSensitiveUserInfo = (req, res, next) => {
  if (req.user) {
    const { first_name, last_name, email, age, cart } = req.user.user;
    req.nonSensitiveUserInfo = { first_name, last_name, email, age, cart };
  }
  next();
};

//Mocking Products
export const generateProducts = () => {
  return {
    id: faker.commerce.isbn(),
    title: faker.commerce.productName(),
    code: faker.number.hex({ min: 100, max: 65535 }),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.number.int(1000),
    thumbnail: faker.image.urlLoremFlickr({ category: "moda" }),
  };
};

//Manejador de errores
export const handleError = (code, res) => {
  const message = code || "Error desconocido";
  res.status(500).json({ error: message });
};
