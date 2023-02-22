import express from "express";
import createError from "http-errors";

const chatsRouter = express.Router();

//get chats
chatsRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//get single chat
chatsRouter.get("/:chatId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//delete single chat
chatsRouter.delete("/:chatId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//post chat
chatsRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
