import { Idea } from "@app/core/src/database/models/Ideas.model";
import { ApiHandler } from "sst/node/api";
import { connectToDatabase } from "@app/core/src/database/connection";

export const handler = ApiHandler(async (_evt, _ctx) => {
  _ctx.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  const allIdeas = await Idea.find({}).populate("author").exec();

  return {
    statusCode: 200,
    body: JSON.stringify(allIdeas, null, 2),
  };
});
