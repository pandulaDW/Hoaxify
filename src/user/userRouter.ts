import { Router } from "express";
import { UserSignUpRequest } from "../models/userModels";
import { save } from "./userService";

const router = Router();

router.post("/", async (req, res) => {
  const { username } = req.body as UserSignUpRequest;
  if (!username) {
    return res.status(400).send({
      validationErrors: {
        username: "username cannot be null",
      },
    });
  }
  await save(req.body);
  res.status(200).send({ message: "user created" });
});

export default router;
