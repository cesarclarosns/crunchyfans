export class MediaTranscodedMessage {
  metadata: { mediaId: string };
  outputs: object;
  hasError: boolean;

  constructor(message: MediaTranscodedMessage) {
    Object.assign(this, message);
  }
}
