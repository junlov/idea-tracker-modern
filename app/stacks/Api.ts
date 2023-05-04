import { StackContext, Api, StaticSite } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          MONGODB_URI: process.env.MONGODB_URI,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
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
