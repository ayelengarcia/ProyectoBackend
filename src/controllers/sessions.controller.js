const sessionsService = new Session();

export const loginLocal = async (req, res) => {
  const result = await sessionsService.loginLocal();

  res.send({ status: "success", payload: result });
};

export const registerLocal = async (req, res) => {
  const result = await sessionsService.registerLocal();

  res.send({ status: "success", payload: result });
};

export const loginGithub = async (req, res) => {
  const result = await sessionsService.loginGithub();

  res.send({ status: "success", payload: result });
};

export const logout = async (req, res) => {
  const result = await sessionsService.logout();

  res.send({ status: "success", payload: result });
};
