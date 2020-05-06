import { useCallback, useEffect, useRef } from 'react';

export function useVideoCapture() {
	const videoReference = useRef();
	const canvasReference = useRef();

	useEffect(() => {
		if (!videoReference.current)
			throw new Error('videoRef must be set before setting video stream.');

		// Prefer the device front-camera.
		const constraints = { video: { facingMode: 'environment' } };

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(stream => {
				// Attach the video stream to the video element and autoplay.
				videoReference.current.srcObject = stream;
			})
			.catch(error => {
				// TODO: Catch and handle common exceptions- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
				throw error;
			});
	}, [videoReference]);

	const takeCameraSnap = useCallback(() => {
		if (!videoReference.current)
			throw new Error('videoRef must be set before taking a camera capture');
		if (!canvasReference.current)
			throw new Error('canvasRef must be set before taking a camera capture.');

		const video = videoReference.current;
		const canvas = canvasReference.current;
		const context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Stop the video stream after snap is taken.
		video.srcObject.getVideoTracks().forEach(track => track.stop());
	}, [videoReference, canvasReference]);

	return { videoRef: videoReference, canvasRef: canvasReference, takeCameraSnap };
}
