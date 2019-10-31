import sharp, { Metadata } from "sharp";
import { Readable, Writable } from "stream";

interface IResolution {
	width: number;
	height: number;
}

export function createThumbnail(source: Readable, destination: Writable): Promise<IResolution> {
	const creator = new ThembnailCreator();

	return creator.process(source, destination).then(
		(): IResolution => {
			console.log(creator.info);
			const { width, height } = creator.info as IResolution;
			return { width, height };
		}
	);
}

class ThembnailCreator {
	public info: Metadata;
	public meta: Metadata;

	private _sharp = sharp();

	process(source: Readable, destination: Writable): Promise<void> {
		this._sharp.metadata(this._onMeta);
		this._sharp.resize(undefined, undefined, { width: 711, height: 400 });

		this._sharp.on("info", this._onInfo);
		this._sharp.on("error", this._onError);

		return new Promise((resolve: () => void): void => {
			this._sharp.on("end", resolve);
			source.pipe(this._sharp).pipe(destination);
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
