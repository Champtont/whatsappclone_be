import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument, usersModel } from "./types";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    userName: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, default: "+1 412 628 0133" },
    avatar: {
      type: String,
      default: "https://img.freepik.com/free-icon/avatar_318-538240.jpg",
    },
    about: { type: String, default: "I am using a clone...I mean whatsApp!" },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
);

usersSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 11);
    currentUser.password = hash;
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const userDoc = this;
  const user = userDoc.toObject();

  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

usersSchema.static("checkCredentials", async function (userName, password) {
  const user = await this.findOne({ userName });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model<UserDocument, usersModel>("users", usersSchema);
