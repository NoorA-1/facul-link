import * as dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

//routers
import userAuthRouter from "./routes/userAuthRouter.js";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import teacherRouter from "./routes/teacherRouter.js";
import employerRouter from "./routes/employerRouter.js";

//public folder
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import cookieParser from "cookie-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());
app.use(express.json());

app.get("/api/v1/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.use("/api/v1/auth", userAuthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/employer", employerRouter);

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

let userSockets = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  userSockets[userId] = socket.id;
  console.log("User connected", socket.id);
  // console.log(userSockets);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSockets[userId];
  });
});

const PORT = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.DB_URL);
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

export { io, userSockets };

export default app;
