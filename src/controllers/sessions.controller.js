import { generateToken } from "../utils.js";
import config from "../config/config.js"

export const registerLocal = async (req, res) => {
    try {
      const user = req.body;
      const access_token = generateToken(user);

      res.cookie(config.secret_cookie, access_token, {
        maxAge: 60*60*10000,
        httpOnly: true
      })
      res.redirect("/login");
    } catch (error) {
      throw error;
    }
};

export const loginLocal = async (req, res) => {
  try {
    if (!req.user) return res.status(400).json({ message: "Credenciales inválidas" });
    const user = req.user;

    try {
      const access_token = generateToken(user);
      res.cookie(config.secret_cookie, access_token, {
        maxAge: 60 * 60 * 10000,
        httpOnly: true
      })
      res.redirect("/profile");
    } catch (error) {
      throw error;
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Error en la autenticación: " + error.message);
  }
};

export const logout = async (req, res) => {
  try {
    const session = req.session;

    session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).json({ success: false, message: 'Error al cerrar sesión', error: err });
      } else {
        res.clearCookie(config.secret_cookie);
        res.redirect("/login");
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cerrar sesión', error: error });
  }
};

export const loginGithub =  async(req, res) => {
  const user = req.user
  const access_token = generateToken(user)

  res.cookie(config.secret_cookie, access_token, {
    maxAge: 60*60*10000,
    httpOnly: true
  }).redirect('/profile')
}
