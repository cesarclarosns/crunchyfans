import { ICommandHandler } from '@nestjs/cqrs';

export class CreateFollowerHandler
  implements ICommandHandler<CreateFollowerHandler>
{
  execute(command: CreateFollowerHandler): Promise<any> {}
}
