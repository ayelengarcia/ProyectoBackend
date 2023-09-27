import UserModel from "./models/userModel.js"

export default class User {

    createUser = async (data) => {
        return await UserModel.create(data);
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
      return await UserModel.findOne({email: email});
    };

    updatedUserById = async (id, updatedUser) => {
      return await UserModel.findByIdAndUpdate(id, updatedUser);
    };

    deletedUser = async (id) => {
      return await UserModel.findByIdAndDelete(id);
    };

}