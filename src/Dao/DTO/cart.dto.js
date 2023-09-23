export default class CartDTO {
  constructor(cartData) {
    this.products = cartData.products.map((productData) => ({
      pid: productData.pid,
      quantity: productData.quantity,
    }));
  }
}
