import { Sequelize } from "sequelize";
import config from "config";
import { DBConfig } from "../models/configModels";

const dbConfig = config.get("database") as DBConfig;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging: false,
  }
);

export default sequelize;
