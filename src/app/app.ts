import express from "express";
import User from "../app/user/User";

const app = express();

// middlewares
app.use(express.json());

app.get("/", (_, res) => {
  res.send("it works!!");
});

app.post("/api/v1/user", async (req, res) => {
  try {
    await User.create(req.body);
    return res.status(201).send({ message: "User created" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({});
  }
});

export default app;
