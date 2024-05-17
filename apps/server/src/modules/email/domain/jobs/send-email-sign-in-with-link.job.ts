export class SendEmailSignInWithLinkJob {
  readonly email: string;
  readonly timestamp: string;
  readonly ip: string;
  readonly userAgent: string;
  readonly link: string;

  constructor(job: SendEmailSignInWithLinkJob) {
    Object.assign(this, job);
  }
}
