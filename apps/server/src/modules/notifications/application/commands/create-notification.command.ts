import { ICommand } from '@nestjs/cqrs';

import { CreateNotificationDto } from '../../domain/dtos/create-notification.dto';

export class CreateNotificationCommand implements ICommand {
  constructor(readonly dto: CreateNotificationDto) {}
}
