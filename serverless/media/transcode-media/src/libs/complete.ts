import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { TranscodeMediaCompleteMessage } from "../schemas";

export async function complete(
  client: SQSClient,
  {
    message,
    queueUrl,
  }: { message: TranscodeMediaCompleteMessage; queueUrl: string }
) {
  return await client.send(
    new SendMessageCommand({
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    })
  );
}
