import { userService } from "../services/index.js";

export const createUser = async (req, res) => {
  const user = req.body;
  try {
    const userCreate = userService.createUser(user);
    res.send({ status: "success", payload: userCreate });
  } catch (e) {
    res.status(500).send("Error al crear el user");
  }
};

export const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await userService.getUsers(limit);

    res.send({ status: "success", payload: result });
    return result;
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req?.params?.email;
    const user = await userService.getUserByEmail(email);

    res.send({ message: "Usuario encontrado", payload: user });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario con email" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);

    res.send({ message: "Usuario encontrado", payload: user });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario con id" });
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
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

export const deletedUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await userService.deletedUser(userId);

    if (result) {
      res.send({ status: "Usuario eliminado exitosamente", payload: result });
    } else {
      res.send({ status: "No se pudo eliminar" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};
