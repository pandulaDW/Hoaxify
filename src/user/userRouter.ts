import { Router } from "express";
import { check, validationResult } from "express-validator";
import { convertToValidationObj } from "./helpers";
import { save } from "./userService";

const router = Router();

const validationMiddlewares = [
  check("username")
    .notEmpty()
    .withMessage("username cannot be empty")
    .bail()
    .isLength({ min: 4 })
    .withMessage("username must have min 4 and max 32 characters"),
  check("email").notEmpty().withMessage("email cannot be empty"),
  check("password").notEmpty().withMessage("password cannot be empty"),
];

router.post("/", ...validationMiddlewares, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(convertToValidationObj(errors));
  }
  await save(req.body);
  res.status(200).send({ message: "user created" });
});

export default router;
