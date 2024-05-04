export class SendEmailSignUpJob {
  readonly email: string;

  constructor(job: SendEmailSignUpJob) {
    Object.assign(this, job);
  }
}
