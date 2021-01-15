import { Dialect } from "sequelize";

export interface DBConfig {
  database: string;
  username: string;
  password: string;
  dialect: Dialect;
  storage: string;
  logging: boolean;
}
