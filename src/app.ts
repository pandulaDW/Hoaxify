import express from "express";
import User from "./user/User";

const app = express();

// parse JSON
app.use(express.json());

app.post("/api/1.0/users", (req, res) => {
  User.create(req.body).then(() => {
    res.status(200).send({ message: "user created" });
  });
});

export default app;
