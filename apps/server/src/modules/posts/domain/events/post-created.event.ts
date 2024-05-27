export class PostCreatedEvent {
  postId: string;

  constructor(event: PostCreatedEvent) {
    Object.assign(this, event);
  }
}
