
export const registerLocal = async (req, res) => {
  async (req, res) => {
    return res.redirect("/login");
  };
};

export const loginLocal = async (req, res) => {
  if (req.isAuthenticated()) {
    console.log(`${req.user.first_name} acaba de iniciar sesión`);

    req.session.user = req.user;
    res.cookie("keyCookieForJWT", req.user.token);

    if (req.user.roles === "Admin") {
      console.log("Rol de Admin");
      return res.redirect("/admin");
    } else {
      console.log("Usuario no esRol de Usuario");
      return res.redirect("/profile");
    }
  } else {
    console.log("Credenciales inválidas");
    return res.status(400).send("Credenciales inválidas");
  }
};

export const loginGithub = async (req, res) => {
  console.log("Callback: ", req.user);

  req.session.user = req.user;
  console.log(req.session);

  res.cookie("keyCookieForJWT", req.user.token).redirect("/profile");
};

export const logout = async (req, res) => {
  if (req.session.user) {
    console.log(`${req.session.user.first_name} acaba de cerrar sesión`);
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al cerrar sesión:", err);
      }
      res.redirect("/login");
    });
  }
};
