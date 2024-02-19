export class SignUpEvent {
  email: string;

  constructor(ev: { email: string }) {
    this.email = ev.email;
  }
}
