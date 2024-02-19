import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { SQSHandler } from "aws-lambda";
import { configSchema, transcodeMediaSubmitMessageSchema } from "./schemas";
import { download } from "./libs/download";
import { transcodeImage } from "./libs/transcode-image";
import { transcodeVideo } from "./libs/transcode-video";
import { TrancodeHandler } from "./types";
import { upload } from "./libs/upload";
import { createReadStream } from "fs";
import { complete } from "./libs/complete";

const config = configSchema.parse({
  S3_BUCKET_MEDIA: process.env.S3_BUCKET_MEDIA,
  SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL:
    process.env.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL,
});

const s3Client = new S3Client();
const sqsClient = new SQSClient();

export const handler: SQSHandler = async (event) => {
  event.Records.map(async ({ body, messageId }) => {
    const message = transcodeMediaSubmitMessageSchema.parse(JSON.parse(body));

    // Download
    const filePath = await download(s3Client, {
      fileKey: message.fileKey,
      bucket: config.S3_BUCKET_MEDIA,
    });

    // Transcode
    let results: Awaited<ReturnType<TrancodeHandler>>;

    if (message.mediaType === "image") {
      results = await transcodeImage(filePath, message.options);
    } else if (message.mediaType === "video") {
      results = await transcodeVideo(filePath, message.options);
    } else {
      throw new Error("Invalid mediaType");
    }

    // Upload
    results.sources.map(async (source) => {
      const readStream = createReadStream(source.filePath);
      upload(s3Client, { fileKey: "", body: readStream, bucket: "" });
    });
    results.thumbnails.map(async (thumbnail) => {
      const readStream = createReadStream(thumbnail.filePath);
      upload(s3Client, { fileKey: "", body: readStream, bucket: "" });
    });

    // Complete
    complete(sqsClient, { message: {} as any, queueUrl: "" });
  });
};

type Result = Awaited<ReturnType<TrancodeHandler>>;
