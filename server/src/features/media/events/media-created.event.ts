export class MediaCreatedEvent {
  mediaId: string;
  mediaType: string;
  fileKey: string;

  constructor(ev: { mediaId: string; mediaType: string; fileKey: string }) {
    this.mediaId = ev.mediaId;
    this.mediaType = ev.mediaType;
    this.fileKey = ev.fileKey;
  }
}
