import { ICommand } from '@nestjs/cqrs';

import { CreateFollowerDto } from '../dtos/create-follower.dto';

export class CreateFollowerCommand implements ICommand {
  constructor(readonly createFollowerDto: CreateFollowerDto) {}
}
