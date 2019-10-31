import * as fs from "fs";
import ffmpeg from "ffmpeg";
import { createThumbnail } from "./createThumbnail";
import { Readable, Writable } from "stream";
import { IMetadata } from ".";

interface IResolution {
	width: number;
	height: number;
	duration?: number;
}

export async function createSnapshotFromVideo(source: string, destination: string): Promise<IResolution> {
	return new Promise((resolve: (meta: IMetadata) => void, reject: (err: Error) => void): void => {
		new ffmpeg(source, (err: Error, video: any): void => {
			if (err) return reject(err);
			video.addCommand("-ss", "00:00:05");
			video.addCommand("-vframes", "1");
			video.save(destination, function(error: Error, file) {
				if (!error) console.log("Video file: " + file);
			});

			const { w: width, h: height } = video.metadata.video.resolution;
			const duration = video.metadata.duration.seconds;

			resolve({ width, height, duration });
		});
	});
}
