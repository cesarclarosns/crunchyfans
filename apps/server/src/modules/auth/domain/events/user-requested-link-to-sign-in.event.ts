export class UserRequestedLinkToSignInEvent {
  readonly email: string;
  readonly timestamp: string;
  readonly link: string;
  readonly ip: string;
  readonly userAgent: string;

  constructor(ev: UserRequestedLinkToSignInEvent) {
    Object.assign(this, ev);
  }
}
