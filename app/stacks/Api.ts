import {
  StackContext,
  Api,
  StaticSite,
  Auth,
  Queue,
  Topic,
} from "sst/constructs";

export function usersApi({ stack }: StackContext) {
  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/Auth/auth.handler",
    },
  });

  const topic = new Topic(stack, "Ordered", {
    subscribers: {
      primary: "packages/functions/src/Queue/consumer.handler",
    },
  });

  const api = new Api(stack, "ideaTrackerApi", {
    defaults: {
      function: {
        bind: [topic],
        environment: {
          MONGODB_URI: process.env.MONGODB_URI,
        },
      },
    },
    routes: {
      "GET /users": "packages/functions/src/Users/getAllUsers.handler",
      "POST /users": "packages/functions/src/Users/createUser.handler",
      "DELETE /users": "packages/functions/src/Users/deleteAllUsers.handler",
      "PUT /users": "packages/functions/src/Users/updateUser.handler",
      "GET /ideas": "packages/functions/src/Ideas/getAllIdeas.handler",
      "POST /ideas": "packages/functions/src/Ideas/createNewIdea.handler",
      "POST /timeline": "packages/functions/src/timeline.handler",
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

  const queue = new Queue(stack, "queue", {
    consumer: "packages/functions/src/Queue/consumer.handler",
  });

  auth.attach(stack, {
    api,
    prefix: "/auth",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    StaticSite: web.url,
    Queue: queue.queueUrl,
  });
}
