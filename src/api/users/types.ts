import { Model, Document } from "mongoose";

interface User {
  userName: string;
  email: string;
  password: string;
  avatar: string;
  role: "User" | "Admin";
}

export interface UserDocument extends User, Document {}

export interface usersModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}
