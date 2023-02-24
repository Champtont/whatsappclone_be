import express from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import ChatsModel from "./model.js";
import MessagesModel from "../messages/model.js";
import UsersModel from "../users/model.js";
import createHttpError from "http-errors";

const chatsRouter = express.Router();
// CHATS
//post new chat
chatsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (req.body.type === "private") {
      const recipient = req.body.members[0];
      req.body.members = [...req.body.members, req.user._id];
      const [checkDublicate] = await ChatsModel.find({
        members: req.body.members,
      });
      if (checkDublicate) {
        next(
          createHttpError(
            403,
            `This chat already exists with ID ${checkDublicate._id.toString()}!`
          )
        );
      } else {
        req.body.members = [req.user._id, recipient];
        const [checkDublicateReverse] = await ChatsModel.find({
          members: req.body.members,
        });
        if (checkDublicateReverse) {
          next(
            createHttpError(
              403,
              `This chat already exists with ID ${checkDublicateReverse._id.toString()}!`
            )
          );
        } else {
          const message = {
            sender: req.user._id,
            text: req.body.firstMessage,
            deleted: false,
          };
          const newMessage = new MessagesModel(message);
          const { _id } = await newMessage.save();

          req.body.members = [...req.body.members];
          req.body.history = [_id];
          req.body.deletedBy = [];

          const chat = {
            type: "private",
            members: req.body.members,
            history: req.body.history,
            deletedBy: req.body.deletedBy,
            firstMessage: req.body.firstMessage,
            room: req.body.room,
          };
          const newChat = new ChatsModel(chat);
          const { id } = await newChat.save();
          res.send({ id });
        }
      }
    } else {
      const message = {
        sender: req.user._id,
        text: req.body.firstMessage,
        deleted: false,
      };

      const newMessage = new MessagesModel(message);

      const { _id } = await newMessage.save();

      req.body.members = [...req.body.members, req.user._id];
      req.body.history = [_id];
      req.body.deletedBy = [];

      const chat = {
        ...req.body,
      };

      const newChat = new ChatsModel(chat);

      const { id } = await newChat.save();

      res.send({ id });
    }
  } catch (error) {
    next(error);
  }
});

chatsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chats = await ChatsModel.find()
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
        select: ["chat", "content"],
      })
      .populate({
        path: "messages.sender",
        model: User,
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
    console.log("🚀 ~ file: index.js:131 ~ chatsRouter.get ~ index:", index);

    if (index !== -1) {
      const updatedChat = await ChatsModel.findByIdAndUpdate(
        req.params.chatId,
        { $push: { deletedBy: req.user._id } },
        { new: true }
      )
        .populate("history")
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
