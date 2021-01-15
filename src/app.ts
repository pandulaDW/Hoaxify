import express from "express";
import userRouter from "./user/userRouter";

const app = express();

// parse JSON
app.use(express.json());

// routers
app.use("/api/1.0/users", userRouter);

export default app;
