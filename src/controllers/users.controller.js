import { userService } from "../services/index.js";
import config from "../config/config.js";
import { handleError, upload } from "../utils.js";

export const createDocuments = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Error al cargar el archivo', error: err.message });
      } else if (err) {
        return res.status(500).json({ message: 'Hubo un error al procesar la solicitud', error: err.message });
      }
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) res.status(404).json({ message: 'Usuario no encontrado' });

      const files = req.files;

      if (files && files.length > 0) {
        user.documents = user.documents.concat(files.map(file => ({
          name: file.originalname,
          reference: file.path,
        })));

        await user.save();
        return res.status(200).json({ message: 'Documentos subidos exitosamente', user });
      }
      return res.status(400).json({ message: 'No se han subido archivos' });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al procesar la solicitud', error: error.message });
  }
};

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
