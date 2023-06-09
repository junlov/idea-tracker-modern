import { ApiHandler } from "sst/node/api";
import { connectToDatabase } from "@app/core/src/database/connection";
import { Users } from "@app/core/database/models/Users.model";

export const handler = ApiHandler(async (_evt, _ctx) => {
  _ctx.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  const user: { email: string } | undefined = JSON.parse(_evt.body);

  const updatedUser = await Users.findOneAndUpdate(
    { email: user?.email },
    user,
    { new: true }
  );

  return {
    statusCode: 200,
    body: JSON.stringify(updatedUser, null, 2),
  };
});
