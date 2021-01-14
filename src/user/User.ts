import { Model, STRING } from "sequelize";
import sequelize from "../config/database";

class User extends Model {}

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
