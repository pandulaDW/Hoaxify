import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.json({
    message: "This ends right here, now!",
  });
});

app.listen(5000, () => {
  console.log("Starting the server...");
});
