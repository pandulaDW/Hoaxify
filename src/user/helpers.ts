import { Result, ValidationError } from "express-validator";
import { ValidationObj } from "../models/userModels";

export const convertToValidationObj = (
  errors: Result<ValidationError>
): ValidationObj => {
  const validationErrors = errors
    .array()
    .reduce<{ [key: string]: string }>((acc, curr) => {
      const message =
        curr.value === null ? `${curr.param} cannot be empty` : curr.msg;
      acc[curr.param] = message;
      return acc;
    }, {});
  return { validationErrors };
};
