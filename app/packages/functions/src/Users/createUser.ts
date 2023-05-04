import { ApiHandler } from "sst/node/api";
import mongoose from "mongoose";
import { Users } from "@app/core/src/database/models/Users.model";

// Once we connect to the database once, we'll store that connection
// and reuse it so that we don't have to connect to the database on every request.
let cachedDb: any = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  mongoose.set("strictQuery", false);

  // Specify which database we want to use
  cachedDb = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return cachedDb;
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

  const user: string | undefined = JSON.parse(_evt.body);
  const { email } = user;

  if (!email) {
    throw Error("Email is required");
  }

  const domain = email.substring(email.lastIndexOf("@") + 1);

  const newUser = await new Users(user);
  const save = await newUser.save();

  console.log(newUser);

  return {
    statusCode: 200,
    body: `User ${newUser} is successfully created`,
  };
});
