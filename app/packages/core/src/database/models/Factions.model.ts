import { Schema, model, Types } from "mongoose";
import { IFactions } from "../types/ideaTypes";
import { Users } from "./Users.model";

const factionSchema = new Schema<IFactions>({
  domain: {
    type: String,
    index: { unique: true },
  },
  hubspotCompanyId: {
    type: String,
  },
  name: {
    type: String,
  },
  members: [{ type: Types.ObjectId, ref: Users }],
});

export const Faction = model<IFactions>("Faction", factionSchema);
