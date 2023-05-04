import { Schema, model, Types } from "mongoose";
import { IUserHistory, IPropertyHistory } from "../types/ideaTypes";

const propertyHistorySchema = new Schema<IPropertyHistory>({
  value: { type: String, default: "" },
  whenModified: { type: Date, default: Date.now() },
});

export const userHistorySchema = new Schema<IUserHistory>({
  firstNameHistory: [propertyHistorySchema],
  lastNameHistory: [propertyHistorySchema],
  rankHistory: [propertyHistorySchema],
  emailHistory: [propertyHistorySchema],
});
