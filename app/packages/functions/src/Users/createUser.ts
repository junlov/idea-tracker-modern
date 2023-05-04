import { Faction } from "@app/core/src/database/models/Factions.model";
import { ApiHandler } from "sst/node/api";
import { Users } from "@app/core/src/database/models/Users.model";
import { connectToDatabase } from "@app/core/src/database/connection";

export const handler = ApiHandler(async (_evt, _ctx) => {
  // By default, the callback waits until the runtime event loop is empty
  // before freezing the process and returning the results to the caller.
  // Setting this property to false requests that AWS Lambda freeze the
  // process soon after the callback is invoked, even if there are events
  // in the event loop.
  _ctx.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  const user: { email: string } | undefined = JSON.parse(_evt.body);
  const { email } = user;

  if (!email) {
    throw Error("Email is required");
  }

  const domain = email.substring(email.lastIndexOf("@") + 1);

  const newUser = await new Users(user);

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

  return {
    statusCode: 200,
    body: JSON.stringify({ savedUser, faction }),
  };
});
