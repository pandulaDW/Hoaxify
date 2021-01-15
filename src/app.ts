import express from "express";
import bcrypt from "bcrypt";
import User from "./user/User";
import { UserAttributes, UserSignUpRequest } from "./models/userModels";

const app = express();

// parse JSON
app.use(express.json());

app.post("/api/1.0/users", async (req, res) => {
  const { username, email, password } = req.body as UserSignUpRequest;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: UserAttributes = { username, email, password: hashedPassword };
  await User.create(user);
  res.status(200).send({ message: "user created" });
});

export default app;
