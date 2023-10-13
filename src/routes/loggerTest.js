import { Router } from "express";
const router = Router();

router.get("/loggerTest", (req, res) => {
  req.logger.fatal("FATAL !!");
  req.logger.error("ERROR se cayo el server");
  req.logger.warning("Esto es una advertencia");

  req.logger.info("Se llamo a esta url");
  req.logger.http("Peticion HTTP");
  req.logger.debug("1 + 1 === 2");

  res.send("Logger Testing");
});

export default router;
