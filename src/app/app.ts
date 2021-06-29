import express from "express";

const app = express();

// middlewares
app.use(express.json());

app.get("/", (_, res) => {
  res.send("it works!!");
});

app.post("/api/v1/user", (req, res) => {
  return res.status(200).send({ message: "User created" });
});

export default app;
