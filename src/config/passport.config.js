import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserModel from "../Dao/mongoManager/models/userModel.js";
import { createHash, isValidPass } from "../utils.js";

const LocalStrategy = local.Strategy;

const initPassport = () => {
  //Login github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.c2c35b26dad584be",
        clientSecret: "02615c26ddd1a880a60d026e41f5b48ab2c71ee7",
        callbackURL: "http://127.0.0.1:8080/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const user = await UserModel.findOne({ email: profile._json.email });

          if (user) {
            console.log("El usuario existe", user.email);
            return done(null, user);
          }
          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
            age: "",
            roles: { type: String, default: "Usuario" },
          };

          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          console.log("Error al iniciar sesión con github", error);
          return done(error);
        }
      }
    )
  );
  //Register local
  passport.use(
    "register",
    new LocalStrategy(
      // Objeto de configuracion
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      //Lo que debe hacer
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, roles } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });

          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
          }

          const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            roles,
          };

          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error de registro", error);
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
          const user = await UserModel.findOne({ email: username })
            .lean()
            .exec();
          if (!user) {
            console.log("El usuario no existe");
            return done(null, false);
          }
          if (!isValidPass(user, password)) {
            console.log("Contraseña incorrecta");
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done("No has podido iniciar sesión", error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initPassport;

// http://127.0.0.1:8080/githubcallback

// App ID: 378939
// Client ID: Iv1.c2c35b26dad584be

//Client Secret
// 02615c26ddd1a880a60d026e41f5b48ab2c71ee7
