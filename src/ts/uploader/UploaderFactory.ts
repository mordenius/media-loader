import { Readable } from "stream";
import { ImageUploader } from "./ImageUploader";
import { VideoUploader } from "./VideoUploader";

export interface IUploader {
	metadata: IMetadata;
	saveOrigin(): Promise<void>;
	createAndSaveThumbnail(): Promise<void>;
}

export interface IMetadata {
	width: number;
	height: number;
	duration: number;
}

export interface IUploaderFactory {
	getImageUploader(source: Readable, filename: string): IUploader;
	getVideoUploader(source: Readable, filename: string): IUploader;
}

export class UploaderFactory implements IUploaderFactory {
	public getImageUploader(source: Readable, filename: string): IUploader {
		return new ImageUploader(source, filename);
	}

	public getVideoUploader(source: Readable, filename: string): IUploader {
		return new VideoUploader(source, filename);
	}
}
