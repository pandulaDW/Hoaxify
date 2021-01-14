import app from "./src/app";
import sequelize from "./src/config/database";

sequelize.sync();

app.listen(5000, () => {
  console.log("Starting the server...");
});
