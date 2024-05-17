export class MediaCreatedEvent {
  mediaId: string;

  constructor(ev: MediaCreatedEvent) {
    Object.assign(this, ev);
  }
}
