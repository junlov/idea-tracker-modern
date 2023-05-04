export * as _userAction from "./User.actions";

import { Users } from "@app/core/src/database/models/Users.model";
import { Faction } from "@app/core/src/database/models/Factions.model";

export async function create(email: string) {
  const domain = email.substring(email.lastIndexOf("@") + 1);

  const newUser = new Users({ email: email });
  const savedUser = await newUser.save();

  const faction = await Faction.findOneAndUpdate(
    {
      domain,
    },
    {
      $push: { members: savedUser._id },
    },
    { upsert: true, new: true }
  );

  return JSON.stringify({ savedUser, faction });
}

export async function fromEmail(email: string) {
  const result = await Users.findOne({ email: email }).exec();

  if (result === null) {
    return null;
  }

  if (result) {
    return result;
  }
}
