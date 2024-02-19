export class ResetPasswordEvent {
  email: string;
  resetPasswordLink: string;

  constructor(ev: { email: string; resetPasswordLink: string }) {
    this.email = ev.email;
    this.resetPasswordLink = ev.resetPasswordLink;
  }
}
