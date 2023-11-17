import * as dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
const app = express();

//routers
import userAuthRouter from "./routes/userAuthRouter.js";
import userRouter from "./routes/userRouter.js";

//public folder
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import cookieParser from "cookie-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(morgan("dev"));

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());
app.use(express.json());

app.get("/api/v1/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.use("/api/v1/auth", userAuthRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res) => {
  res.status(404).send({ message: "404 Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.statusCode === 400) {
    res.status(400).send({ message: "Bad Request" });
  } else if (err.statusCode === 404) {
    res.status(404).send({ message: "404 route not found" });
  } else if (err.statusCode === 500) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.DB_URL);
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
