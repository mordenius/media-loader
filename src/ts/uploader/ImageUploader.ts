import { createWriteStream } from "fs";

import { AUploader } from "./AUploader";
import { createThumbnail } from "./createThumbnail";
import { Readable, Writable, Stream } from "stream";
import { removeAllListeners } from "cluster";

export class ImageUploader extends AUploader {
	saveOrigin(): Promise<void> {
		const dest = createWriteStream(`${process.cwd()}/temp/thumbnail/` + "/" + this._filename, {
			flags: "w",
			encoding: "utf8"
		});

		return new Promise((resolve: () => void, reject: (err: Error) => void): void => {
			dest.on("error", reject);
			dest.on("open", resolve);
		});
	}

	async saveImgOriginAndThumbnail(): Promise<void> {
		const source: Readable = this._source;

		const origin: Writable = createWriteStream(`${process.cwd()}/temp` + "/" + this._filename, {
			flags: "w",
			encoding: "utf8"
		});
		const thumbnail: Writable = createWriteStream(`${process.cwd()}/temp/thumbnail` + "/" + this._filename, {
			flags: "w",
			encoding: "utf8"
		});

		const { promise, stream } = createThumbnail(this._source);
		const { width, height } = await promise;
		this._metadata = { width, height, duration: 0 };

		const listener = (chunk: Buffer): void => {
			origin.emit("data", chunk);
			stream.emit("data", chunk);
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
}
