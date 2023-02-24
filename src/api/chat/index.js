import express from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import ChatsModel from "./model.js";
import MessagesModel from "../messages/model.js";
import createHttpError from "http-errors";

const chatsRouter = express.Router();
// CHATS
//post new chat
chatsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newChat = new ChatsModel(req.body);
    const { id } = await newChat.save();

    res.send({ id });
  } catch (error) {
    next(error);
  }
});

chatsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chats = await ChatsModel.find({ members: req.user._id })
      .populate({
        path: "members",
        select: ["userName", "phone", "avatar"],
      })
      .transform((doc) => {
        const docs = doc.map((chat) => {
          const sortedMembers = chat.members.sort(
            (a, b) => (a._id == req.user._id) - (b._id == req.user._id)
          );
          chat.members = sortedMembers;
          return chat;
        });
        return docs;
      });
    res.send(chats);
  } catch (error) {
    res.send(error);
    next(error);
  }
});

chatsRouter.get("/:chatId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chat = await ChatsModel.findById(req.params.chatId)
      .populate({
        path: "messages",
        select: "chat content",
        populate: {
          path: "sender",
          model: "User",
          select: "userName phone avatar",
        },
      })
      .populate({
        path: "members",
        select: ["userName", "phone", "avatar"],
      });

    const index = chat.members.findIndex(
      (m) => m._id.toString() === req.user._id
    );

    if (index !== -1) {
      res.send(chat);
    } else {
      next(
        createHttpError(
          401,
          `Authorization failed for chat with ID ${req.params.chatId}!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

chatsRouter.delete("/:chatId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chat = await ChatsModel.findById(req.params.chatId);
    const index = chat.members.findIndex(
      (m) => m._id.toString() === req.user._id
    );

    if (index !== -1) {
      const updatedChat = await ChatsModel.findByIdAndUpdate(
        req.params.chatId,
        { $push: { deletedBy: req.user._id } },
        { new: true }
      )
        .populate("history", { strictPopulate: false })
        .populate("members")
        .populate("deletedBy");

      res.send(updatedChat);
    } else {
      next(
        createHttpError(
          401,
          `Authorization failed for chat with ID ${req.params.chatId}!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
