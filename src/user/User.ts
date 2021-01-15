import { Model, STRING } from "sequelize";
import sequelize from "../config/database";
import { UserAttributes } from "../models/userModels";

class User extends Model<UserAttributes> {
  public username!: string;
  public email!: string;
  public password!: string;
}

User.init(
  {
    username: {
      type: STRING,
    },
    email: {
      type: STRING,
    },
    password: {
      type: STRING,
    },
  },
  { sequelize, modelName: "user" }
);

export default User;
