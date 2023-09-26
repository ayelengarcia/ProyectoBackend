import dotenv from "dotenv";

dotenv.config();

export default {
  persistence: process.env.PERSISTENCE,
  port: process.env.PORT || 8080,
  dbName: process.env.DB_NAME,
  dbURL:process.env.MONGO_URL,
  // CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
  // CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
  // CALLBACK_URL_GITHUB: process.env.CALLBACK_URL_GITHUB,
  // SECRET_JWT: process.env.SECRET_JWT,
};
