export class Tokens {
  accessToken: string;
  refreshToken: string;

  constructor(model: Tokens) {
    Object.assign(this, model);
  }
}
