import { ApiHandler } from "sst/node/api";
import mongoose from "mongoose";
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

  // Make a MongoDB MQL Query
  const users = await Users.find({});

  return {
    statusCode: 200,
    body: JSON.stringify(users, null, 2),
  };
});
