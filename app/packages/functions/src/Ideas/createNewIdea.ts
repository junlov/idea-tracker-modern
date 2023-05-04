import { Idea } from "@app/core/src/database/models/Ideas.model";
import { ApiHandler } from "sst/node/api";
import { connectToDatabase } from "@app/core/src/database/connection";

export const handler = ApiHandler(async (_evt, _ctx) => {
  _ctx.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  const body = JSON.parse(_evt.body);
  const { idea } = body;

  const dbResponse = await Idea.create(idea);
  const populatedIdea = await dbResponse.populate("author");

  dbResponse.save();

  return {
    statusCode: 200,
    body: JSON.stringify({ dbResponse }, null, 2),
  };
});
