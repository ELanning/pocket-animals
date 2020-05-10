import { useCallback, useEffect, useRef } from 'react';
import { assert } from './assert';

export function useVideoCapture() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		// Prefer the device front-camera.
		const constraints = { video: { facingMode: 'environment' } };

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(stream => {
				assert(videoRef.current, 'videoRef must be set before setting video stream.');

				// Attach the video stream to the video element and autoplay.
				videoRef.current.srcObject = stream;
			})
			.catch(error => {
				// TODO: Catch and handle common exceptions- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
				throw error;
			});
	}, [videoRef]);

	const takeCameraSnap = useCallback(() => {
		assert(videoRef.current, 'videoRef must be set before taking a camera capture');
		assert(canvasRef.current, 'canvasRef must be set before taking a camera capture.');

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d') as CanvasRenderingContext2D;
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Stop the video stream after snap is taken.
		const srcObject = video.srcObject as MediaStream;
		srcObject.getVideoTracks().forEach(track => track.stop());
	}, [videoRef, canvasRef]);

	return { videoRef, canvasRef, takeCameraSnap };
}
