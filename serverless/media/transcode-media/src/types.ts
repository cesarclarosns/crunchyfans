import { TranscodingOptions } from "./schemas";

export interface Source {
  filePath: string;
  quality: string;
  duration?: string;
}

export interface Thumbnail {
  filePath: string;
  quality: string;
}

export type TrancodeHandler = (
  filePath: string,
  options: TranscodingOptions
) => Promise<{
  sources: Source[];
  thumbnails: Thumbnail[];
}>;
