import { InjectFlowProducer } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';

@Injectable()
export class UserSignedInWithLinkProducer {
  constructor(
    @InjectFlowProducer() private readonly flowProducer: FlowProducer,
  ) {}

  sendMessage() {}
}
