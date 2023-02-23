import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Message", MessageSchema);
