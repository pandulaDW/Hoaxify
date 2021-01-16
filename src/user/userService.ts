import bcrypt from "bcrypt";
import User from "./User";
import { UserAttributes, UserSignUpRequest } from "../models/userModels";

export const save = async (reqBody: UserSignUpRequest) => {
  const { password } = reqBody;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: UserAttributes = { ...reqBody, password: hashedPassword };
  return await User.create(user);
};
