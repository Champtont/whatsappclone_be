import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", required: true }],
    name: { type: String },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
