import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("it works");
});

export default app;
