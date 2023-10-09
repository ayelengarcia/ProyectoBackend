export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createCart = async () => {
    return await this.dao.createCart();
  };

  getCarts = async (limit) => {
    if (limit) {
      const carts = await this.dao.getCarts();
      return carts.slice(0, limit);
    } else {
      return await this.dao.getCarts();
    }
  };

  getCartById = async (id) => {
    return await this.dao.getCartById(id);
  };

  addProductCart = async (cid, pid, quantity) => {
    return await this.dao.addProductCart(cid, pid, quantity);
  };

  deleteProductCart = async (cid, pid) => {
    return await this.dao.deleteProductCart(cid, pid);
  };

  deleteCartById = async (id) => {
    return await this.dao.deleteCartById(id);
  };

  finishPurchase = async (cid) => {
    return await this.dao.finishPurchase(cid);
  };
}
