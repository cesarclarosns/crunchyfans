export class Chat {
  id: string;
  participants: string[];

  constructor(model: Chat) {
    Object.assign(this, model);
  }
}
