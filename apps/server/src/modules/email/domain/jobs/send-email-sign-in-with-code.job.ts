export class SendEmailSignInWithCodeJob {
  readonly email: string;
  readonly link: string;

  constructor(job: SendEmailSignInWithCodeJob) {
    Object.assign(this, job);
  }
}
