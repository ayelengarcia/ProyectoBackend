export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createUser = async (data) => {
    return await this.dao.createUser(data);
  };

  createDocuments = async (id, files, fileType) =>{
    return await this.dao.createDocuments(id, files, fileType)
  }

  getUsers = async (limit) => {
    return await this.dao.getUsers(limit);
  };

  getUserByEmail = async (email) => {
    return await this.dao.getUserByEmail(email);
  };

  getUserById = async (id) => {
    return await this.dao.getUserById(id);
  };

  updatedUserById = async (id, updatedUser) => {
    return await this.dao.updatedUserById(id, updatedUser);
  };

  updatedUserRole = async (id, updatedRole) => {
    return await this.dao.updatedUserById(id, updatedRole);
  };

  deletedUser = async (id) => {
    return await this.dao.deletedUser(id);
  };
}
