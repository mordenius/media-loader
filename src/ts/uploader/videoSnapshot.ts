import * as fs from "fs";
import ffmpeg from "ffmpeg";
import { createThumbnail } from "./createThumbnail";
import { Readable, Writable } from "stream";

interface IResolution {
	width: number;
	height: number;
	duration?: number;
}



export async function createSnapshotFromVideo(source: string, destination: string): Promise<IResolution> {
	const video = await new ffmpeg(source);

	video.addCommand('-ss', '00:01:30')
	video.addCommand('-vframes', '1')
    video.save(destination, function (error, file) {
        if (!error)
          console.log('Video file: ' + file);
      });

	// const { w: width, h: height } = video.metadata.video.resolution;
	// const duration = video.metadata.duration.seconds;

	const { w: width, h: height } = video.metadata.video.resolution;
	const duration = video.metadata.duration.seconds;

	return { width, height, duration };
}

// export async function createSnapshotFromVideo(source, filename, destinationFolder): Promise<IResolution> {
// 	const video = await _getVideoFromFFmpeg(source + filename);
// 	await _extractFramesToJpg(video, filename, destinationFolder);

// 	const { w: width, h: height } = video.metadata.video.resolution;
// 	const duration = video.metadata.duration.seconds;

// 	return { width, height, duration };
// }

// function _getVideoFromFFmpeg(source: string): Promise<any | Error> {
// 	return new Promise((resolve, reject): void => {
// 		new ffmpeg(source, function(err, video) {
// 			if (err) reject(err);
// 			else resolve(video);
// 		});
// 	});
// }

// function _extractFramesToJpg(video: any, filename: string, destinationFolder: string): Promise<void> {
// 	const options = {
// 		frame_rate: 1,
// 		number: 1,
// 		file_name: filename
// 	};

// 	return new Promise((resolve, reject): void => {
// 		const cb = function(error) {
// 			if (error) reject(error);
// 			else _saveThumbnail(filename, destinationFolder, resolve, reject);
// 		};

// 		video.fnExtractFrameToJPG(destinationFolder, options, cb);
// 	});
// }

// async function _saveThumbnail(
// 	filename: string,
// 	destinationFolder: string,
// 	cbSuccess: () => void,
// 	cbReject: (err: Error) => void
// ): Promise<void> {
// 	const name = filename.split(".")[0];
// 	const sourcePath = destinationFolder + name + "_1.jpg";

// 	try {
// 		await createThumbnail(sourcePath, { path: destinationFolder, filename: name + ".jpg", resolution: { width: 200, height: 200 }, quality: 20 });
// 		fs.unlinkSync(sourcePath);
// 		cbSuccess();
// 	} catch (err) {
// 		cbReject(err);
// 	}
// }
