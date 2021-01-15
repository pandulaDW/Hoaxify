import { Router } from "express";
import { save } from "./userService";

const router = Router();

router.post("/", async (req, res) => {
  await save(req.body);
  res.status(200).send({ message: "user created" });
});

export default router;
