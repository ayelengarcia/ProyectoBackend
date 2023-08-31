import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPass = (user, password) => {
  return bcrypt.compareSync(password, user.password); //true or false
};

export const generateToken = (user) => {
  return jwt.sign({ user }, "secretForJWT", { expiresIn: "24h" });
};

export const extractCookie = (req) => {
  return req && req.cookies ? req.cookies["keyCookieForJWT"] : null;
};
