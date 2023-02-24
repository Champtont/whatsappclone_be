import express from "express";
import MessagesModel from "./model.js";
import ChatsModel from "../chat/model.js";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";

const messagesRouter = express.Router();

//post new message in the chat
messagesRouter.post(
  "/:chatId/messages",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const newMessage = new MessagesModel({
        chat: req.params.chatId,
        sender: req.user._id,
        content: req.body.content,
      });
      console.log(req.body);
      const { _id } = await newMessage.save();
      if (newMessage) {
        const messageToInsert = {
          ...newMessage,
          content: req.body,
          chat: req.params.chatId,
        };
        console.log(messageToInsert);
        const updatedChat = await ChatsModel.findByIdAndUpdate(
          req.params.chatId,
          { $push: { messages: messageToInsert } },
          { new: true, runValidators: true }
        );
        if (updatedChat) {
          res.send(updatedChat);
          console.log(updatedChat);
        } else {
          next(
            createHttpError(
              404,
              `Message with id ${req.params.chatId} not found!`
            )
          );
        }
      } else {
        next(
          createHttpError(404, `Chat with id ${req.body.chatId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//Delete a message
messagesRouter.delete("/:chatId/:messageId", async (req, res, next) => {
  try {
    const updatedChat = await ChatsModel.findByIdAndUpdate(
      req.params.chatId,
      { $pull: { messages: { _id: req.params.messageId } } },
      { new: true, runValidators: true }
    );
    if (updatedChat) {
      res.send(updatedChat);
    } else {
      next(
        createHttpError(404, `Chat with id ${req.params.chatId} was not found`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default messagesRouter;
