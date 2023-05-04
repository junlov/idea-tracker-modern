import { Schema, model, connect } from "mongoose";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  numIdeasSubmitted?: number;
  numCommentsLeft?: number;
  signUpDate: Date;
  lastLoginDate: Date;
  numLogins: number;
  hubspotContactId?: string;
  rank?: string;
  // propertyHistory?: IUserHistory;
}

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
  // propertyHistory: { type: userHistorySchema },
});

export const User = model<IUser>("User", userSchema);
