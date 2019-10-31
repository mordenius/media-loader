import { Readable } from "stream";
import { CONTENT_EXTENSION, IMetadata, IUploader } from "./_interfaces";
import { UploaderFactory, IUploaderFactory } from "./UploaderFactory";

export { CONTENT_EXTENSION, IMetadata, IUploader };

const factory = new UploaderFactory();

export function getUploader({ routes: { origin } }: { routes: { origin: string } }): IUploader {
	return (source: Readable, name: string, ext: CONTENT_EXTENSION): Promise<IMetadata> => {
		switch (ext) {
			case CONTENT_EXTENSION.JPEG:
				return factory.getImageUploader(source, name, ext)(source, name, ext);
			case CONTENT_EXTENSION.MP4:
				return factory.getVideoUploader(source, name, ext)(source, name, ext);
			default:
				throw new Error(`Unsupported file extension`);
		}
	};
}
