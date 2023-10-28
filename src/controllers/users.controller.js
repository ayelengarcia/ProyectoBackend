import { userService } from "../services/index.js";
import config from "../config/config.js";
import { handleError } from "../utils.js";

export const createUser = async (req, res) => {
  const user = req.body;
  try {
    const userCreate = userService.createUser(user);
    res.send({ status: "success", payload: userCreate });
  } catch (e) {
    req.logger.error("No se pudo crear usuario");
    handleError(config.user_not_add, res);
  }
};

export const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await userService.getUsers(limit);

    res.send({ status: "success", payload: result });
    return result;
  } catch (error) {
    req.logger.error("No se pudo obtener usuarios");
    handleError(config.user_not_found, res);
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req?.params?.email;
    const user = await userService.getUserByEmail(email);

    res.send({ message: "Usuario encontrado", payload: user });
  } catch (error) {
    req.logger.error("No se pudo obtener usuario por email");
    handleError(config.user_not_found, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);

    res.send({ message: "Usuario encontrado", payload: user });
  } catch (error) {
    req.logger.error("No se pudo obtener usuario por id");
    handleError(config.user_not_found, res);
  }
};

export const updatedUserById = async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, age, password, cart, roles } = req.body;
  const updatedUser = {
    first_name,
    last_name,
    email,
    age,
    password,
    cart,
    roles,
  };

  try {
    const result = await userService.updatedUserById(userId, updatedUser);

    res.send({ status: "Usuario actualizado exitosamente", payload: result });
  } catch (error) {
    req.logger.error("No se pudo actualizar usuario");
    handleError(config.user_not_update, res);
  }
};

export const updatedUserRole = async (req, res) => {
  const userId = req.params.id;
  const { roles } = req.body;
  const updatedRole = { roles };

  try {
    const result = await userService.updatedUserById(userId, updatedRole);

    res.send({ status: "Rol actualizado exitosamente", payload: result });
  } catch (error) {
    req.logger.error("No se pudo actualizar rol");
    handleError(config.user_not_update, res);
  }
};

export const deletedUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await userService.deletedUser(userId);

    if (result) {
      res.send({ status: "Usuario eliminado exitosamente", payload: result });
    } else {
      req.logger.warning("No se pudo eliminar usuario");
      res.send({ status: "No se pudo eliminar" });
    }
  } catch (error) {
    req.logger.error("Error al eliminar usuario");
    handleError(config.user_not_delete, res);
  }
};
