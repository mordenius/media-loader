import { createWriteStream } from "fs";
import { AUploader } from "./AUploader";
import { createSnapshotFromVideo } from "./videoSnapshot";

export class VideoUploader extends AUploader {
	saveOrigin(): Promise<void> {
		const dest = createWriteStream(this._originPath + "/" + this._filename, { flags: "w", encoding: "utf8" });

		return new Promise((resolve: () => void, reject: (err: Error) => void): void => {
			dest.on("error", reject);
			dest.on("close", resolve);

			this._source.pipe(dest);
		});
	}

	async createAndSaveThumbnail(): Promise<void> {
		const originPath = this._originPath + "/" + this._filename;
		const thumbnailPath = this._thumbPath + "/" + this._filename;
		const { width, height, duration } = await createSnapshotFromVideo(originPath, thumbnailPath);
		this._metadata = { width, height, duration: duration || 0 };
	}
}
