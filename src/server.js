import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { newConnectionHandler } from "./socket/index.js";
import {
  badRequestHandler,
  unauthorizedHandler,
  genericErrorHandler,
  forbiddenHandler,
} from "./errorHandlers.js";
import usersRouter from "./api/users/index.js";
import chatsRouter from "./api/chat/index.js";
import messagesRouter from "./api/messages/index.js";

export const expressServer = express();

expressServer.use(cors());
expressServer.use(express.json());

//Socket.IO
export const httpServer = createServer(expressServer);
const io = new Server(httpServer);
io.on("connection", newConnectionHandler);

//endpoints

//server.use("/users", usersRouter);
expressServer.use("/chats", chatsRouter);
expressServer.use("/users", usersRouter);
expressServer.use("/chats", chatsRouter);
expressServer.use("/messages", messagesRouter);

expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(genericErrorHandler);

export default expressServer;
