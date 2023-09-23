import dotenv from "dotenv";

dotenv.config();

export default {
  persistence: process.env.PERSISTENCE,
  port: process.env.PORT || 8080,
  dbName: "DBecommerce",
  dbURL:
    "mongodb+srv://ayelengarcia7:eIXUnjHpOu7NgSKF@clustercoder.t6a33ln.mongodb.net/?retryWrites=true&w=majority",
};
