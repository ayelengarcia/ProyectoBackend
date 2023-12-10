import UserModel from "./models/userModel.js";

export default class User {
  createUser = async (data) => {
    return await UserModel.create(data);
  };

 createDocuments = async (userId, files, fileType) => {
    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
  
      if (files && files.length > 0) {
        const updatedDocuments = files.map(file => ({
          fileType: fileType,
          name: file.originalname,
          reference: file.path,
        }));
  
        user.documents = user.documents.concat(updatedDocuments);
        await user.save();
        return { message: 'Documentos subidos exitosamente', user };
      }
  
      throw new Error('No se han subido archivos');
    } catch (error) {
      throw new Error('Hubo un error al procesar la solicitud: ' + error.message);
    }
  };

  getUsers = async (limit) => {
    if (limit) {
      const users = await UserModel.find();
      return users.slice(0, limit);
    } else {
      return UserModel.find();
    }
  };

  getUserByEmail = async (email) => {
    return await UserModel.findOne({ email: email });
  };

  getUserById = async (id) => {
    return await UserModel.findById(id);
  };

  updatedUserById = async (id, updatedUser) => {
    return await UserModel.findByIdAndUpdate(id, updatedUser);
  };

  updatedUserRole = async (id, updatedRole) => {
    return await UserModel.findByIdAndUpdate(id, updatedRole);
  };

  deletedUser = async (id) => {
    return await UserModel.findByIdAndDelete(id);
  };
}
