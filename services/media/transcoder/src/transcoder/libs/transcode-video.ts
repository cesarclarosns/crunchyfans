import ffmpeg from "fluent-ffmpeg";
import { ffprobe, run, watermarkPositionMap } from "./ffmpeg";
import type { Source, Thumbnail, TrancodeHandler } from "../old/types";

const THUMBNAIL_HEIGHT = 720;
const SOURCE_HEIGHTS = [240, 720];

const MAX_HEIGHT = 1080;

export const transcodeVideo: TrancodeHandler = async (filePath, options) => {
  const fileName = filePath.split("/").at(-1)!;

  const metadata = await ffprobe(filePath);
  console.log("metadata", metadata);

  const videoHeight = metadata.streams[0].height;
  const videoDuration = metadata.streams[0].duration;

  if (!videoHeight || !videoDuration)
    throw new Error("Cannot read video metadata");

  // Define heights
  let heights = Array.from(
    new Set([...SOURCE_HEIGHTS, Math.min(videoHeight, MAX_HEIGHT)])
  );
  heights = heights.filter((height) => height <= videoHeight);

  // Transcode
  const sources: Source[] = [];

  const command = ffmpeg(filePath);

  if (options.needsWatermark) {
    const watermarkText = options.watermarkText;
    const watermarkPosition = watermarkPositionMap.get(
      options.watermarkPosition
    );

    command.complexFilter([
      {
        filter: "drawtext",
        options: `fontsize=(h/30): ${watermarkPosition}: text='${watermarkText}': fontfile=/Windows/Fonts/arial.ttf: fontcolor=white@0.7`,
        inputs: ["0"],
        outputs: ["[watermarked]"],
      },
      {
        filter: "split",
        options: `${heights.length}`,
        inputs: ["[watermarked]"],
        outputs: heights.map((height) => `[watermarked_${height}]`),
      },
      ...heights.map((height) => ({
        filter: "scale",
        options: `w=trunc(oh*a/2)*2: h=${height}`,
        inputs: [`[watermarked_${height}]`],
        outputs: [`[output_${height}]`],
      })),
    ]);
  } else {
    command.complexFilter([
      {
        filter: "split",
        options: `${heights.length}`,
        inputs: ["0"],
        outputs: heights.map((height) => {
          return `[source_${height}]`;
        }),
      },
      ...heights.map((height) => {
        return {
          filter: "scale",
          options: `w=trunc(oh*a/2)*2: h=${height}`,
          inputs: [`[source_${height}]`],
          outputs: [`[output_${height}]`],
        };
      }),
    ]);
  }

  for (const height of heights) {
    const filePath = `/tmp/${height}_${fileName}`;
    sources.push({
      filePath,
      quality: `${height}`,
      duration: videoDuration,
    });

    command.output(filePath).map(`[output_${height}]`);
  }

  await run(command);

  const thumbnails = await createThumbnails(
    filePath,
    ["0%"],
    Math.min(THUMBNAIL_HEIGHT, videoHeight)
  );

  return { sources, thumbnails };
};

export async function createThumbnails(
  filePath: string,
  timestamps: string[],
  height: number
): Promise<Thumbnail[]> {
  const results = await Promise.all(
    timestamps.map(async (timestamp) => {
      return await new Promise<string[]>((resolve, reject) => {
        const outputs: string[] = [];

        ffmpeg(filePath)
          .thumbnails({
            timestamps: [timestamp],
            size: `?x${height}`,
            filename: `thumbnail_at_%ss.png`,
            folder: "/tmp",
          })
          .on("start", (cmd) => {
            console.log("start", cmd);
          })
          .on("filenames", (filenames: string[]) => {
            console.log("filenames", filenames);
            for (const filename of filenames) {
              outputs.push(`/tmp/${filename}`);
            }
          })
          .on("end", () => {
            console.log("end");
            resolve(outputs);
          })
          .on("error", (err) => {
            console.log("err");
            reject(err);
          });
      });
    })
  );

  return results
    .flat(2)
    .map((output) => ({ filePath: output, quality: `${height}` }));
}
