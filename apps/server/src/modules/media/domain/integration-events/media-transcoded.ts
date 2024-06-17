export type MediaTranscodingStatusUpdate =
  | { status: 'COMPLETE' }
  | { status: 'ERROR'; errorMessage: string };
