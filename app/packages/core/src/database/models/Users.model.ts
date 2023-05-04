import { Schema, model, connect } from "mongoose";
import { IUser } from "../types/ideaTypes";
import { userHistorySchema } from "./UserHistory.model";

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    index: { unique: true },
  },
  password: {
    type: String,
  },
  numIdeasSubmitted: {
    type: Number,
  },
  numCommentsLeft: {
    type: Number,
  },
  signUpDate: {
    type: Date,
    default: Date.now(),
  },
  lastLoginDate: {
    type: Date,
    default: Date.now(),
  },
  numLogins: {
    type: Number,
    default: 1,
  },
  hubspotContactId: {
    type: String,
    index: true,
  },
  rank: {
    type: String,
  },
  propertyHistory: { type: userHistorySchema },
});

export const Users = model<IUser>("User", userSchema);
