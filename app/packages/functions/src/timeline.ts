import { ApiHandler } from "sst/node/api";
import { SNS } from "@aws-sdk/client-sns";
import { Topic } from "sst/node/topic";
import { Config } from "sst/node/config";

const sns = new SNS(Config.APP);

export const handler = ApiHandler(async (_evt, _ctx) => {
  await sns.publish({
    // Get the topic from the environment variable
    TopicArn: Topic.Ordered.topicArn,
    Message: "JSON.stringify({ ordered: true })",
    MessageStructure: "string",
  });

  console.log("Order confirmed!");

  const sqsFormat = {
    Records: [
      {
        body: "Successful from Timeline",
      },
    ],
  };

  return {
    statusCode: 200,
    body: JSON.stringify(sqsFormat),
  };
});
