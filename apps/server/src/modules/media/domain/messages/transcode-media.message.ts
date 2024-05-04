export class TranscodeMediaMessage {
  fileKey: string;
  metadata: { mediaId: string };
  options: {
    needsWatermark: boolean;
    needsThumbnail: boolean;
    needsPreview: boolean;
  };
}
