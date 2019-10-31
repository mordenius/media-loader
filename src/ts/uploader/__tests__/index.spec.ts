import { createReadStream, existsSync, } from "fs";
import { CONTENT_EXTENSION, getUploader, IMetadata, IUploader } from "./..";
import { Readable } from "stream";

const ZERO_DURATION = 0;
const CONFIG = {
  thumbnail: {
    width: 120
  },
  routes: {
    origin: `${process.cwd()}/temp/`,
    thumbnail: `${process.cwd()}/temp/thumbnail/`
  }
};

describe("Not implemented", (): void => {
  const upload: IUploader = getUploader(CONFIG);

  describe("Images", () => {
    const path = process.cwd() + "/temp/1.jpeg"

    const destinationName = "some-name";
    const extension = CONTENT_EXTENSION.JPEG;

    let source: Readable;
    let metadata: IMetadata;

    beforeAll((done: () => void): void => {

      source = createReadStream(path);

      upload(source, destinationName, extension).then((meta: IMetadata): void => {
        metadata = meta;
        done();
      })
    });

    it("returned value", (): void => {
      expect(typeof metadata.width).toBe("number");
      expect(typeof metadata.height).toBe("number");
      expect(metadata.duration).toBe(ZERO_DURATION);
    });

    it("origin file is saved", (): void => {
      const fileFullPath = CONFIG.routes.origin + destinationName + "." + extension;
      const isExist: boolean = existsSync(fileFullPath);

      expect(isExist).toBeTruthy();
    });
  });

  xdescribe("Video", (): void => {
    // const source = createReadStream(process.cwd() + "/temp/1.mp4");
    // upload(source, "some-name", CONTENT_EXTENSION.MP4)
    // 	.then((meta: IMetadata): void => {
    // 		console.log(`
    // 	width: ${meta.width},
    // 	height: ${meta.height},
    // 	duration: ${meta.duration}
    // `);
    // 	})
    // 	.catch((err: Error): void => {
    // 		console.log(err.message);
    // 	});
  });
});
