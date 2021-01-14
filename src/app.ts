import express, { RequestHandler } from "express";

const app = express();

const handler: RequestHandler = (req, res) => {
  res.json({
    message: "This ends right here",
  });
};

app.get("/", handler);

app.listen(5000, () => {
  console.log("Starting the server...");
});
