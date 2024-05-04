import { SignUpSaga } from '@/modules/auth/application/sagas/sign-up/sign-up.saga';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { User } from '@/modules/users/domain/models/user.model';
import { IUsersService } from '@/modules/users/domain/services/users.service';

export interface ISagaStep {
  input: any;
  output: any;

  execute: () => Promise<void>;

  compensate: () => Promise<void>;
}

export class SagaOrchestrator {
  steps: ISagaStep[] = [];

  addStep(step: ISagaStep) {
    this.steps.push(step);
  }
}

class CreateUserStep implements ISagaStep {
  constructor(private readonly usersService: IUsersService) {}

  input: CreateUserDto;
  output: User;

  async execute(): Promise<void> {
    const user = await this.usersService.createUser(this.input);
    this.output = user;
  }

  async compensate(): Promise<void> {
    if (this.output) {
      await this.usersService.deleteUser(this.output.id);
    }
  }
}

class SendEmailSignUpStep implements ISagaStep {
  constructor() {}

  input: any;
  output: any;
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

(async () => {
  const saga = new SagaOrchestrator();

  try {
    // CreateUserStep
    const createUserStep = new CreateUserStep({} as any);
    createUserStep.input = new CreateUserDto({} as any);
    saga.addStep(createUserStep);
    await createUserStep.execute();

    // SendEmailSignUpStep
    const sendEmailSignUpStep = {};

    return createUserStep.output;
  } catch (error) {
    for (const step of saga.steps.reverse()) {
      await step.compensate();
    }
  }
})();
