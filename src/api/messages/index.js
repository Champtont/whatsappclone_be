import express from "express";
import MessagesModel from "./model.js";
import ChatsModel from "../chat/model.js";
import createHttpError from "http-errors";

const messagesRouter = express.Router();

messagesRouter.post("/:chatId/messages", async (req, res, next) => {
  try {
    const newMessage = new MessagesModel(req.body);
    console.log(req.body);
    if (newMessage) {
      const messageToInsert = {
        ...newMessage,
        content: req.body.content,
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
            `Product with id ${req.params.chatId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `Review with id ${req.body.messageId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

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
