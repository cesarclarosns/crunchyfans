import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable } from '@nestjs/common';

import { config } from '@/config';

@Injectable()
export class SnsService {
  private readonly snsClient = new SNSClient({
    credentials: {
      accessKeyId: config.AWS.ACCESS_KEY_ID,
      secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
    },
    region: config.AWS.REGION,
  });

  async publish({ message, topicArn }: { message: string; topicArn: string }) {
    return await this.snsClient.send(
      new PublishCommand({ Message: message, TopicArn: topicArn }),
    );
  }
}
