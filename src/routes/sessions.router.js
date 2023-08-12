import { Router } from "express";
import UserModel from "../Dao/mongoManager/models/userModel.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email, password });

  if (!user) return res.redirect("/login");

  req.session.user = user;

  res.redirect("/profile");
});

router.post("/register", async (req, res) => {
  const user = req.body;
  await UserModel.create(user);

  return res.redirect("/login");
});

export default router;
