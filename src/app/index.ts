import app from "./app";
import sequelize from "../app/config/database";

// initialzing db
sequelize.sync();

app.listen(4000, () => {
  console.log("listening to stuff on port 4000...");
});
