import { Readable } from "stream";
import { IMetadata } from "./_interfaces";

export abstract class AUploader {
	protected readonly _source: Readable;

	protected _originPath: string = `${process.cwd()}/temp/`;
	protected _thumbPath: string = `${process.cwd()}/temp/thumbnail/`;

	protected readonly _filename: string;

	protected _metadata: IMetadata = {
		width: 0,
		height: 0,
		duration: 0
	};

	constructor(source: Readable, filename: string) {
		this._source = source;
		this._filename = filename;
	}

	public get metadata(): IMetadata {
		return this._metadata;
	}

	public abstract saveOrigin(): Promise<void>;
	public abstract saveImgOriginAndThumbnail(): Promise<void>;
}
