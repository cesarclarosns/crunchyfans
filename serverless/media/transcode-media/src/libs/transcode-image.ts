import ffmpeg from "fluent-ffmpeg";
import { ffprobe, run, watermarkPositionMap } from "./ffmpeg";
import { Source, Thumbnail, TrancodeHandler } from "../types";

const THUMBNAIL_HEIGHTS = [300];
const SOURCE_HEIGHTS = [600];

const MAX_HEIGHT = 1080;

export const transcodeImage: TrancodeHandler = async (filePath, options) => {
  const fileName = filePath.split("/").at(-1);

  // Get metadata
  const metadata = await ffprobe(filePath);
  console.log("metadata", metadata);

  const imageHeight = metadata.streams[0].height;

  if (!imageHeight) throw new Error("Cannot read image metadata");

  // Define heights
  let heights = Array.from(
    new Set([
      ...(options.needsThumbnails ? THUMBNAIL_HEIGHTS : []),
      ...SOURCE_HEIGHTS,
      Math.min(imageHeight, MAX_HEIGHT),
    ])
  );
  heights = heights.filter((height) => height <= imageHeight);

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
        outputs: heights.map((height) => `[source_${height}]`),
      },
      ...heights.map((height) => ({
        filter: "scale",
        options: `w=trunc(oh*a/2)*2: h=${height}`,
        inputs: [`[source_${height}]`],
        outputs: [`[output_${height}]`],
      })),
    ]);
  }

  for (const height of heights) {
    const filePath = `/tmp/${height}_${fileName}`;
    sources.push({ filePath, quality: `${height}` });

    command.output(filePath).map(`[output_${height}]`);
  }

  await run(command);

  return { sources, thumbnails: [] };
};
