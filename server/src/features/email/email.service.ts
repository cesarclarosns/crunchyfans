import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AUTH_EVENTS, ResetPasswordEvent, SignUpEvent } from '../auth/events';

@Injectable()
export class EmailService {
  @OnEvent(AUTH_EVENTS.ResetPassword)
  handleAuthResetPasswordEvent(payload: ResetPasswordEvent) {
    console.log({ payload });
  }

  @OnEvent(AUTH_EVENTS.SignUp)
  handleAuthSignUpEvent(payload: SignUpEvent) {
    console.log({ payload });
  }
}
