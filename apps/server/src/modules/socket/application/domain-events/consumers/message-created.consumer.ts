import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { ChatsGateway } from '@/modules/socket/presentation/gateways/chats.gateway';

export class MessageCreatedConsumer {
  constructor(
    @InjectPinoLogger(MessageCreatedConsumer.name)
    private readonly _logger: PinoLogger,
    private readonly _chatsGateway: ChatsGateway,
  ) {}
}
