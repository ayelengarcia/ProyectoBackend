import FileManager from "./managers/FileManager.js";

export default class User extends FileManager {

    constructor(filename = "./ddbb/users.json") {
        super(filename);
      }

    createUser = async (data) => {
    const  {first_name, last_name, email, age, password} = data;
    const usersAll = await this.getObjects();
    const newIndex = usersAll.length;

    if (!first_name || !email || !password) console.log("Todos los campos son obligatorios.");

    const newUser = {
      id: newIndex + 1,
      first_name,
      last_name: last_name || "",
      email,
      age: age || "",
      password,
      cart:[],
      roles: "Usuario",
    };

    const idExiste = usersAll.some((user) => user.id === newUser.id);
    if (idExiste) newUser.id = + (newUser.id + "0");

    usersAll.push(newUser);
    await this.writeObjects(usersAll);
    return newUser
  };

  getUsers = async (limit) => {
    if (limit) {
      const users = await this.getObjects();
      return users.slice(0, limit);
    } else {
      return this.getObjects();
    }
  };

  getUserByEmail = async (userEmail)=>{
    const usersAll = await this.getObjects();
    const user = usersAll.find((user) => user.email === userEmail);
    if (!user) throw new Error("No se encuentra.")
    return user;
  }

  updatedUserById = async (id, updateUser) =>{
    return await this.updateObject(id, updateUser);
  }

  deletedUser = async (id) => {
    return await this.deleteObjets(id);
  };

}