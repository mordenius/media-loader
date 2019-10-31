import { createWriteStream } from "fs";
import { AUploader } from "./AUploader";
import { createThumbnail } from "./createThumbnail";
import { Readable, Writable, Stream } from "stream";
import { removeAllListeners } from "cluster";

export class ImageUploader extends AUploader {
	saveOrigin(): Promise<void> {
		const dest = createWriteStream(this._originPath + "/" + this._filename, { flags: "w", encoding: "utf8" });

		return new Promise((resolve: () => void, reject: (err: Error) => void): void => {
			dest.on("error", reject);

			dest.on("open", resolve);

			this._source.pipe(dest);
		});
	}

	syncStreams(stream: Stream, resolve?: any) {
		const source: Readable = new Readable();

		const origin: Writable = new Writable();
		const thumbnail: Writable = new Writable();

		const listener = (chunk: Buffer): void => {
			origin.emit("data", chunk);
			thumbnail.emit("data", chunk);
		};

		source.on("data", listener);

		source.resume();

		source.on("end", () => {
			removeAllListeners("data");
		});
		source.on("close", () => {
			removeAllListeners("data");
		});
	}

	async createAndSaveThumbnail(): Promise<void> {
		const dest = createWriteStream(this._thumbPath + "/" + this._filename, { flags: "w", encoding: "utf8" });

		const { width, height } = await createThumbnail(this._source, dest);
		this._metadata = { width, height, duration: 0 };
	}
}
