import { ApiHandler } from "sst/node/api";
import { connectToDatabase } from "@app/core/src/database/connection";
import { User } from "../../../core/src/actions/User.actions";

interface User {
  email: string;
}

export const handler = ApiHandler(async (_evt, _ctx) => {
  // By default, the callback waits until the runtime event loop is empty
  // before freezing the process and returning the results to the caller.
  // Setting this property to false requests that AWS Lambda freeze the
  // process soon after the callback is invoked, even if there are events
  // in the event loop.
  _ctx.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  const user = JSON.parse(_evt.body);
  const { email } = user;

  if (!email) {
    throw Error("Email is required");
  }

  const createUser = await User.create(email);

  return {
    statusCode: 200,
    body: createUser,
  };
});
