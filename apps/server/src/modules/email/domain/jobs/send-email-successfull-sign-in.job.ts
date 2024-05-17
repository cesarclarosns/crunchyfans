export class SendEmailSuccesfullSignInJob {
  readonly email: string;
  readonly timestamp: string;
  readonly ip: string;
  readonly userAgent: string;

  constructor(job: SendEmailSuccesfullSignInJob) {
    Object.assign(this, job);
  }
}
