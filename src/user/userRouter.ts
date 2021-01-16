import { Router, RequestHandler, Request } from "express";
import { UserSignUpRequest } from "../models/userModels";
import { save } from "./userService";

const router = Router();

interface ValidationReq extends Request {
  validationErrors?: {
    [key: string]: string;
  };
}

const validateUserName: RequestHandler = (req: ValidationReq, _, next) => {
  const { username } = req.body as UserSignUpRequest;
  if (!username) {
    req.validationErrors = {
      ...req.validationErrors,
      username: "username cannot be null",
    };
  }
  next();
};

const validateEmail: RequestHandler = (req: ValidationReq, _, next) => {
  const { email } = req.body as UserSignUpRequest;
  if (!email) {
    req.validationErrors = {
      ...req.validationErrors,
      email: "email cannot be null",
    };
  }
  next();
};

router.post(
  "/",
  validateUserName,
  validateEmail,
  async (req: ValidationReq, res) => {
    if (req.validationErrors) {
      const response = { validationErrors: { ...req.validationErrors } };
      return res.status(400).send(response);
    }
    await save(req.body);
    res.status(200).send({ message: "user created" });
  }
);

export default router;
