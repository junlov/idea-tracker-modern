import { ApiHandler } from "sst/node/api";
import { connectToDatabase } from "@app/core/src/database/connection";

export const handler = ApiHandler(async (_evt, _ctx) => {
  _ctx.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  // Make a MongoDB MQL Query
  const users = await User.find({});

  return {
    statusCode: 200,
    body: JSON.stringify(users, null, 2),
  };
});
