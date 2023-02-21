import express from "express";
import cors from "cors";
import {
  badRequestHandler,
  unauthorizedHandler,
  genericErrorHandler,
  forbiddenHandler,
} from "./errorHandlers";
import usersRouter from "./api/users";

const server = express();

server.use(cors());
server.use(express.json());

//endpoints
server.use("/users", usersRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(genericErrorHandler);

export default server;