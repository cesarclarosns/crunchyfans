export class UserSignedInEvent {
  readonly email: string;
  readonly timestamp: string;
  readonly ip: string;
  readonly userAgent: string;

  constructor(ev: UserSignedInEvent) {
    Object.assign(this, ev);
  }
}
