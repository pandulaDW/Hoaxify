const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.end("This ends right here");
});

app.listen(5000, () => {
  console.log("Starting the server...");
});
