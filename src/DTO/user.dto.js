export default class UserDTO {
    constructor(userData) {
      this.first_name = userData.first_name;
      this.last_name = userData.last_name;
      this.email = userData.email;
      this.age = userData.age;
      this.password = userData.password;
      this.cart = userData.cart;
      this.roles = userData.roles;
    }
  }
  