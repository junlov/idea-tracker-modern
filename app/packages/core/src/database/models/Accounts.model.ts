import { Schema, model } from "mongoose";
import { IAccounts } from "../types/ideaTypes";

const accountSchema = new Schema<IAccounts>({
  accountId: {
    type: Number,
    index: { unique: true },
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
});

export const Accounts = model<IAccounts>("Accounts", accountSchema);
