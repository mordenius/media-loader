import { createWriteStream } from "fs";
import { AUploader } from "./AUploader";
import { createThumbnail } from "./createThumbnail";

export class ImageUploader extends AUploader {
	saveOrigin(): Promise<void> {
		const dest = createWriteStream(this._originPath + "/" + this._filename, { flags: "w", encoding: "utf8" });

		return new Promise((resolve: () => void, reject: (err: Error) => void): void => {
			dest.on("error", reject);
			dest.on("close", resolve);

			this._source.pipe(dest);
		});
	}

	async createAndSaveThumbnail(): Promise<void> {
		const dest = createWriteStream(this._thumbPath + "/" + this._filename, { flags: "w", encoding: "utf8" });

		const { width, height } = await createThumbnail(this._source, dest);
		this._metadata = { width, height, duration: 0 };
	}
}
