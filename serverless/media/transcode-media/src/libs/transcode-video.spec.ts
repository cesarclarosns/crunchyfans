import test, { describe } from "node:test";
import fs from "fs";
import { transcodeVideo } from "./transcode-video";

describe("transcodeVideo", () => {
  test("transcode", async () => {
    const filePath =
      "/Users/cesar/Desktop/Samples/pexels_videos_1409899 (2160p).mp4";

    if (fs.existsSync(filePath)) {
      transcodeVideo(filePath, {
        needsWatermark: true,
        needsThumbnails: true,
        watermarkText: "crunchyfans.com/cesarclarosns",
        watermarkPosition: "bottom-right",
      });
    } else {
      throw new Error("file does not exist");
    }
  });
});
