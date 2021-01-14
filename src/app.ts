import express from "express";

const app = express();

app.post("/api/1.0/users", (req, res) => {
  res.status(200).send({ message: "user created" });
});

export default app;
