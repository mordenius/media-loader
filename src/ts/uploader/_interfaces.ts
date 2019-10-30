import { Readable } from "stream";

export enum CONTENT_EXTENSION {
	MP4 = "mp4",
	PNG = "png",
	GIF = "gif",
	JPEG = "jpeg"
}

export interface IMetadata {
	width: number;
	height: number;
	duration: number;
}

export type IUploader = (
	source: Readable,
	name: string,
	ext: CONTENT_EXTENSION
) => Promise<IMetadata>;
