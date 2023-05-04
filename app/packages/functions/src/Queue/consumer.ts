import { SQSEvent } from "aws-lambda";

export async function handler(event: SQSEvent) {
  console.log("event", event);
  const records: any[] = event.Records;
  console.log(`Message processed: "${records[0].body}"`);

  return {};
}
