import { Schema, model, Types } from "mongoose";
import { IIdeas } from "../types/ideaTypes";
import { Users } from "./Users.model";

const ideaSchema = new Schema<IIdeas>({
  title: {
    type: String,
  },
  detail: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  author: { type: Types.ObjectId, ref: Users },
});

export const Idea = model<IIdeas>("Idea", ideaSchema);
