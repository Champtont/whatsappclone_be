import express from "express";
import createHttpError from "http-errors";
import ChatsModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
const chatsRouter = express.Router();

//get chats
chatsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chatHistory = await ChatsModel.find({
      members: { $in: [req.user_id] },
    });
    res.send(chatHistory);
  } catch (error) {
    next(error);
  }
});

//get single chat
chatsRouter.get("/:chatId", async (req, res, next) => {
  try {
    const chat = await ChatsModel.findById(req.params.chatId)
      .populate({
        path: "message",
        populate: { path: "sender", select: "userName avatar" },
      })
      .populate({ path: "members", select: "userName avatar" });
    res.send(chat);
  } catch (error) {
    next(error);
  }
});

//delete single chat
chatsRouter.delete("/:chatId", async (req, res, next) => {
  try {
    const deletedChat = await ChatsModel.findByIdAndDelete(req.params.chatId);
    if (deletedChat) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Chat with ID ${req.params.chatId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

//MESSAGES

//delete single message
chatsRouter.delete("/:chatId/messages/:messageId", async (req, res, next) => {
  try {
    //     const chat = await ChatsModel.findById(req.params.chatId);
    //     if(chat) {
    //         const message =  await MessagesModel.findById(req.params.messageId)
    //         if (message) {
    //             const deletedMessage = await MessageModel.findByIdAndDelete(req.params.messageId)
    //             res.status(202).send("Message deleted");
    //             message.save
    //         } else
    //         {next(createHttpError(404, `Message with ID ${req.params.messageId} not found`},
    //     } else {
    //         next(createHttpError(404, `Chat with ID ${req.params.chatId} not found`}
  } catch (error) {
    next(error);
  }
});

//put single message
chatsRouter.put("/:chatId/messages/:messageId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
