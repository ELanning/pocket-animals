import { useEffect, useCallback, useRef } from 'react';

export function useVideoCapture() {
	const videoRef = useRef();
	const canvasRef = useRef();

	useEffect(() => {
		if (videoRef.current == null)
			throw new Error('videoRef must be set before setting video stream.');

		// Prefer the device front-camera.
		const constraints = { video: { facingMode: 'environment' } };

		// TODO: Catch and handle common exceptions- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
		navigator.mediaDevices.getUserMedia(constraints).then(stream => {
			// Attach the video stream to the video element and autoplay.
			videoRef.current.srcObject = stream;
		});
	}, [videoRef]);

	const takeCameraSnap = useCallback(() => {
		if (videoRef.current == null)
			throw new Error('videoRef must be set before taking a camera capture');
		if (canvasRef.current == null)
			throw new Error('canvasRef must be set before taking a camera capture.');

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Stop the video stream after snap is taken.
		video.srcObject.getVideoTracks().forEach(track => track.stop());
	}, [videoRef, canvasRef]);

	return { videoRef, canvasRef, takeCameraSnap };
}
