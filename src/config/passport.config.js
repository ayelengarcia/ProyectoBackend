import UserMongo from "../Dao/mongoManager/user.mongo.js";
import CartMongo from "../Dao/mongoManager/cart.mongo.js";
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import passportJWT from "passport-jwt";
import config from "./config.js";
import {
  createHash,
  isValidPass,
  extractCookie,
  generateToken,
} from "../utils.js";

//Preguntar error de controller en passport.
// import { getUserByEmail } from "../controllers/users.controller.js";

const userMongo = new UserMongo();
const cartMongo = new CartMongo();

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const initPassport = () => {
  //Login github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.client_id_gith,
        clientSecret: config.client_secret_gith,
        callbackURL: config.callback_url_gith,
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        try {
          const user = await userMongo.getUserByEmail(profile._json.email);
          const cart = await cartMongo.createCart();

          if (user) {
            const token = generateToken(user);
            user.token = token;
            console.log("Usuario existente logueado con github");
            return done(null, user);
          } else {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: 0,
              password: "",
              cart: cart._id,
              roles: "Usuario",
            };

            const result = await userMongo.createUser(newUser);
            console.log("Nuevo usuario logueado con github");

            const token = generateToken(result);
            result.token = token;
            return done(null, result);
          }
        } catch (e) {
          return done("Error de login GITHUB", e);
        }
      }
    )
  );

  //Register local
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, roles } = req.body;
        try {
          const user = await userMongo.getUserByEmail(username);
          const cart = await cartMongo.createCart();

          if (user) {
            console.log("El user ya existe");
            const token = generateToken(user);
            user.token = token;

            return done(null, user);
          } else {
            const newUser = {
              first_name,
              last_name,
              email,
              roles,
              age,
              password: createHash(password),
              cart: cart._id,
            };

            const result = await userMongo.createUser(newUser);
            console.log("Usuario creado");

            const token = generateToken(result);
            result.token = token;
            return done(null, result);
          }
        } catch (e) {
          return done("Error de registro LOCAL", e);
        }
      }
    )
  );

  //Login local
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userMongo.getUserByEmail(username);

          if (!user) {
            console.log("El usuario no existe");
            return done(null, false);
          }
          if (!isValidPass(user, password)) {
            console.log("Contraseña incorrecta");
            return done(null, false);
          }

          const payload = {
            sub: user._id,
            roles: user.roles,
          };

          const token = generateToken(payload);
          return done(null, user, { token });
        } catch (e) {
          return done("Error de login LOCAL", e);
        }
      }
    )
  );

  //Autenticación. Extrae y valida el JWT
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: config.secret_jwt,
      },
      async (jwt_payload, done) => {
        return done(null, jwt_payload);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userMongo.getUserById(id);
    done(null, user);
  });
};

export default initPassport;
