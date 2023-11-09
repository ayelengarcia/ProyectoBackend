export default class ProductDTO {
  constructor(productData) {
    this.title = productData.title;
    this.thumbnail = productData.thumbnail;
    this.description = productData.description;
    this.stock = productData.stock;
    this.price = productData.price;
    this.code = productData.code;
  }
}
