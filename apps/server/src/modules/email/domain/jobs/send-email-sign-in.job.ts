export class SendEmailSignInJob {
  readonly email: string;
  readonly ip: string;
  readonly userAgent: string;

  constructor(job: SendEmailSignInJob) {
    Object.assign(this, job);
  }
}
