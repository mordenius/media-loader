import { Readable } from "stream";
import { ImageUploader } from "./ImageUploader";
import { VideoUploader } from "./VideoUploader";
import { CONTENT_EXTENSION, IUploader } from "./_interfaces";

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
	getImageUploader(source: Readable, filename: string, ext: CONTENT_EXTENSION): IUploader;
	// getVideoUploader(source: Readable, filename: string, ext: CONTENT_EXTENSION): IUploader;
}

export class UploaderFactory implements IUploaderFactory {
	public getImageUploader(source: Readable, filename: string, ext: CONTENT_EXTENSION): IUploader {
		return async (source: Readable, filename: string, ext: CONTENT_EXTENSION): Promise<IMetadata> => {
			const imageLoader = new ImageUploader(source, filename + "." + ext);
			await imageLoader.saveOrigin();
			await imageLoader.createAndSaveThumbnail();
			return imageLoader.metadata;
		};
	}

	public getVideoUploader(source: Readable, filename: string, ext: CONTENT_EXTENSION): IUploader {
		return async (source: Readable, filename: string, ext: CONTENT_EXTENSION): Promise<IMetadata> => {
			const videoLoader = new VideoUploader(source, filename + "." + ext);
			await videoLoader.saveOrigin();
			await videoLoader.createAndSaveThumbnail();
			return videoLoader.metadata;
		};
	}
}
