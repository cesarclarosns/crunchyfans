import { z } from "zod";

export interface Message {
  mediaId: string;
  mediaType: string;
  fileKey: string;
  options: {
    watermarkPosition: string;
    watermarkText: string;
    needsThumbnails: boolean;
    needsWatermark: boolean;
  };
  outputs: {
    sources: { quality: string; fileKey: string; duration: number }[];
    thumbnails: { fileKey: string }[];
  };
}

export const transcodingOptionsSchema = z.object({
  watermarkText: z.string(),
  watermarkPosition: z.enum([
    "top",
    "top-left",
    "top-right",
    "center",
    "bottom",
    "bottom-left",
    "bottom-right",
  ]),
  needsThumbnails: z.boolean(),
  needsWatermark: z.boolean(),
});

export type TranscodingOptions = z.infer<typeof transcodingOptionsSchema>;

export const transcodeMediaSubmitMessageSchema = z.object({
  mediaId: z.string(),
  mediaType: z.enum(["image", "video"]),
  fileKey: z.string(),
  options: transcodingOptionsSchema,
});

export type TranscodeMediaSubmitMessage = z.infer<
  typeof transcodeMediaSubmitMessageSchema
>;

export const transcodeMediaCompleteMessageSchema =
  transcodeMediaSubmitMessageSchema.extend({
    thumbnails: z.array(z.object({ fileKey: z.string() })),
    sources: z.array(z.object({ quality: z.string(), fileKey: z.string() })),
  });

export type TranscodeMediaCompleteMessage = z.infer<
  typeof transcodeMediaCompleteMessageSchema
>;

export const configSchema = z.object({
  S3_BUCKET_MEDIA: z.string(),
  SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL: z.string(),
});
