import app from "./src/app";
import sequelize from "./src/config/database";

// noinspection JSIgnoredPromiseFromCall
sequelize.sync({ force: true });

app.listen(5000, () => {
  console.log("Starting the server...");
});
