import { Result, ValidationError } from "express-validator";
import { ValidationObj } from "../models/userModels";

export const convertToValidationObj = (
  errors: Result<ValidationError>
): ValidationObj => {
  const validationErrors = errors
    .array()
    .reduce<{ [key: string]: string }>((acc, curr) => {
      acc[curr.param] = curr.msg;
      return acc;
    }, {});
  return { validationErrors };
};
