import { ApiHandler } from "sst/node/api";
import { Time } from "@serverless/core/time";

export const handler = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: `Hi there, it's Junior - Your boy - ${Time.now()}`,
  };
});
