import sharp, { Metadata } from "sharp";
import { Readable } from "stream";
import { createWriteStream } from "fs";

interface IResolution {
	width: number;
	height: number;
}

export function createThumbnail(
	source: Readable
): {
	stream: Readable;
	promise: Promise<IResolution>;
} {
	const creator = new ThembnailCreator();

	const promise = creator.process(source).then(
		(): IResolution => {
			console.log(creator.info);
			const { width, height } = creator.info as IResolution;
			return { width, height };
		}
	);
	return {
		promise,
		stream: creator.sharp
	};
}

class ThembnailCreator {
	public info: Metadata;
	public meta: Metadata;

	public sharp = sharp();

	// process(source: Readable, destination: Writable): Promise<void> {
	process(source: Readable): Promise<void> {
		this.sharp.metadata(this._onMeta);
		this.sharp.resize(undefined, undefined, { width: 711, height: 400 });

		this.sharp.on("info", this._onInfo);
		this.sharp.on("error", this._onError);

		return new Promise((resolve: () => void): void => {
			this.sharp.on("end", resolve);
		});
	}

	private _onMeta = (err: Error, meta: Metadata): void => {
		if (err) return this._onError(err);
		this.meta = meta;
	};

	private _onInfo = (meta: Metadata): void => {
		this.info = meta;
	};

	private _onError = (err: Error): void => {
		console.log(err.message);
	};
}
