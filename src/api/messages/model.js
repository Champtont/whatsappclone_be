import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessagesSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      text: { type: String },
      media: { type: String },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Message", MessagesSchema);
