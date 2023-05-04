import { StackContext, Api, StaticSite } from "sst/constructs";

export function usersApi({ stack }: StackContext) {
  const api = new Api(stack, "ideaTrackerApi", {
    defaults: {
      function: {
        environment: {
          MONGODB_URI: process.env.MONGODB_URI,
        },
      },
    },
    routes: {
      "GET /users": "packages/functions/src/Users/getAllUsers.handler",
      "POST /users": "packages/functions/src/Users/createUser.handler",
      "DELETE /users": "packages/functions/src/Users/deleteAllUsers.handler",
    },
  });

  const web = new StaticSite(stack, "site", {
    path: "packages/web",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    StaticSite: web.url,
  });
}
