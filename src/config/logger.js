import winston from "winston";
import config from "./config.js";
let entorno = config.entorno;

const customLevelsLoggers = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "green",
    http: "blue",
    debug: "white",
  },
};

export const logger = winston.createLogger({
  levels: customLevelsLoggers.levels,
  transports: [
    new winston.transports.Console({
      level: entorno === "PRODUCCION" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsLoggers.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} on ${req.url} - ${new Date().toLocaleString()}`
  );

  next();
};
