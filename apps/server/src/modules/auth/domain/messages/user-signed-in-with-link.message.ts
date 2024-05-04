export class UserSignedInWithLinkEvent {
  constructor(
    readonly email: string,
    readonly timestamp: string,
    readonly link: string,
  ) {}
}
