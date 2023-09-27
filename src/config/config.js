import dotenv from "dotenv";

dotenv.config();

export default {
  persistence: process.env.PERSISTENCE,
  port: process.env.PORT || 8080,
  dbName: process.env.DB_NAME,
  dbURL:process.env.MONGO_URL,
  client_id_gith: process.env.CLIENT_ID_GITHUB,
  client_secret_gith: process.env.CLIENT_SECRET_GITHUB,
  callback_url_gith: process.env.CALLBACK_URL_GITHUB,
  secret_jwt: process.env.SECRET_JWT,
  secret_cookie: process.env.SECRET_COOKIE_JWT
};
