import test, { describe, it } from "node:test";
import { transcodeImage } from "./transcode-image";
import fs from "fs";

describe("transcodeImage", () => {
  test("transcode", async () => {
    const filePath = "/Users/cesar/Desktop/Samples/SampleJPGImage_10mbmb.jpg";

    if (fs.existsSync(filePath)) {
      transcodeImage(filePath, {
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
