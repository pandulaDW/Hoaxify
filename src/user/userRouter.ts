import { Router } from "express";
import { check, validationResult } from "express-validator";
import { convertToValidationObj } from "./helpers";
import { save, findByEmail } from "./userService";

const router = Router();

const validationMiddlewares = [
  check("username")
    .notEmpty()
    .withMessage("username cannot be empty")
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage("username must have min 4 and max 32 characters"),
  check("email")
    .notEmpty()
    .withMessage("email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail()
    .custom(async (email: string) => {
      const user = await findByEmail(email);
      if (user) throw new Error("email in use");
    }),
  check("password")
    .notEmpty()
    .withMessage("password cannot be empty")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(
      "password must have at least 1 uppercase, 1 lowercase and 1 number"
    ),
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
