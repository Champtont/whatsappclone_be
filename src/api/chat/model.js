import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [
      { type: Schema.Types.ObjectId, ref: "Message", required: false },
    ],
    name: { type: String, required: true },
    avatar: {
      type: String,
      requiured: false,
      default: "https://picsum.photos/200",
    },
    room: {type: String}
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
