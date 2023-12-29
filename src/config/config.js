import dotenv from "dotenv";

dotenv.config();

export default {
  persistence: process.env.PERSISTENCE,
  entorno: process.env.ENTORNO, //PRODUCCION o DESARROLLO
  port: process.env.PORT || 8080,
  dbName: process.env.DB_NAME,
  dbNameTest: process.env.DB_NAME_TEST,
  dbURL: process.env.MONGO_URL,

  secretKeyStripe: process.env.SECRET_KEY_STRIPE,
  publicKeyStripe: process.env.PUBLIC_KEY_STRIPE,

  public_key_nave: process.env.PUBLIC_KEY_MP_NAVE,
  access_token_nave: process.env.ACCESS_TOKEN_MP_NAVE,

  client_id_gith: process.env.CLIENT_ID_GITHUB,
  client_secret_gith: process.env.CLIENT_SECRET_GITHUB,
  callback_url_gith: process.env.CALLBACK_URL_GITHUB,

  secret_jwt: process.env.SECRET_JWT,
  secret_cookie: process.env.SECRET_COOKIE_JWT,

  twilio_sid: process.env.TWILIO_ACOUNT_SID,
  twilio_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone: process.env.TWILIO_PHONE,

  product_not_add: "Error al agregar productos",
  product_not_found: "Error al obtener productos",
  product_not_update: "Error al actualizar productos",
  product_not_delete: "Error al eliminar productos",

  cart_not_add: "Error al agregar carrito",
  cart_not_found: "Error al obtener carritos",
  cart_not_delete: "Error al eliminar carrito",
  cart_not_purchase: "Error al finalizar compra",
  cart_not_add_product: "Error al agregar producto al carrito",
  cart_not_delete_product: "Error al eliminar producto del carrito",

  user_not_add: "Error al agregar usuario",
  user_not_found: "Error al obtener usuario",
  user_not_update: "Error al actualizar usuario",
  user_not_delete: "Error al eliminar usuario",

  ticket_not_add: "Error al agregar ticket",
  ticket_not_found: "Error al obtener ticket",
  ticket_not_update: "Error al actualizar ticket",
  ticket_not_delete: "Error al eliminar ticket",
};
