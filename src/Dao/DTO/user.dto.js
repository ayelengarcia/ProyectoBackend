export default class UserDTO {
  constructor(user) {
    this.firstName = user?.first_name ?? "NN";
    this.lastName = user?.last_name ?? "NN";
    this.email = user?.email ?? "";
    this.age = user?.age ?? "0";
    this.roles = user?.roles ?? "Usuario";
    this.password = user?.password ?? "";
    this.cart = user?.cart ?? {};
  }
}
