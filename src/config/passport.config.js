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
import { userService } from "../services/index.js";
import { cartService } from "../services/index.js";
import { logger } from "./logger.js";

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
        logger.info(profile);
        try {
          const user = await userService.getUserByEmail(profile._json.email);
          const cart = await cartService.createCart();

          if (user) {
            const token = generateToken(user);
            user.token = token;
            logger.info("Usuario existente logueado con github");

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

            const result = await userService.createUser(newUser);
            logger.info("Nuevo usuario logueado con github");

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
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userService.getUserByEmail(username);
          const cart = await cartService.createCart();

          if (user) {
            logger.info("El user ya existe");
            const token = generateToken(user);
            user.token = token;

            return done(null, user);
          } else {
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              cart: cart._id,
            };

            const result = await userService.createUser(newUser);
            logger.info("Usuario creado");

            const token = generateToken(result);
            result.token = token;
            return done(null, result);
          }
        } catch (e) {
          console.error(e);
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
          const user = await userService.getUserByEmail(username);

          if (!user) {
            logger.info("El usuario no existe");
            return done(null, false);
          }
          if (!isValidPass(user, password)) {
            logger.info("Contraseña incorrecta");
            return done(null, false);
          }

          const payload = {
            sub: user._id,
            roles: user.roles,
          };

          const token = generateToken(payload);
          return done(null, user, { token });
        } catch (e) {
          console.log(e)
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
    const user = await userService.getUserById(id);
    done(null, user);
  });
};

export default initPassport;
