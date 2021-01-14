import { Sequelize } from "sequelize";

const sequelize = new Sequelize("hoaxify", "my-db-user", "db-password", {
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

export default sequelize;
