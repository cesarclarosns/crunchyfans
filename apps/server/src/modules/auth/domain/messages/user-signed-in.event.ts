export class UserSignedInEvent {
  constructor(
    readonly email: string,
    readonly timestamp: string,
    readonly ip: string,
    readonly userAgent: string,
  ) {}
}
