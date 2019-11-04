import { createReadStream, existsSync } from "fs";
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

const PATH_IMG = process.cwd() + "/temp/1.jpeg";
const PATH_VIDEO = process.cwd() + "/temp/1.mp4";

describe("Not implemented", (): void => {
	const upload: IUploader = getUploader(CONFIG);

	const destinationName = "some-name";
	xdescribe("Images", () => {
		const extension = CONTENT_EXTENSION.JPEG;

		let source: Readable;
		let metadata: IMetadata;

		beforeAll((done: () => void): void => {
			source = createReadStream(PATH_IMG);

			upload(source, destinationName, extension).then((meta: IMetadata): void => {
				metadata = meta;
				done();
			});
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

	describe("Video", (): void => {
		const source = createReadStream(PATH_VIDEO);
		it("Video metadata", (done: () => void): void => {
			upload(source, destinationName, CONTENT_EXTENSION.MP4).then((meta: IMetadata): void => {
				expect(typeof meta.width).toBe("number");
				expect(typeof meta.height).toBe("number");
				expect(meta.duration).toBeGreaterThan(ZERO_DURATION);
				done();
			});
		});

		it("Cheking file exist", (done: () => void): void => {
			expect(!existsSync(PATH_VIDEO)).toBeFalsy();
			done();
		});
	});
});
