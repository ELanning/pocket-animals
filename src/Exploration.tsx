import * as mobileNet from '@tensorflow-models/mobilenet';
import React, { FunctionComponent } from 'react';

import { useVideoCapture } from './useVideoCapture';

// Start model loading as soon as possible to reduce upfront cost.
const mobileNetPromise = mobileNet.load();

interface Props {
	onPrediction: (predictions: { className: string; probability: number }[]) => void;
}

export const Exploration: FunctionComponent<Props> = ({ onPrediction }: Props) => {
	const { videoRef, canvasRef, takeCameraSnap } = useVideoCapture();

	const handleCameraCapture = async () => {
		takeCameraSnap();
		const model = await mobileNetPromise;
		const predictions = await model.classify(canvasRef.current as HTMLCanvasElement);
		onPrediction(predictions);
	};

	return (
		<div className="App">
			<header className="App-header">
				<video id="player" autoPlay ref={videoRef}></video>
				<button id="capture" onClick={handleCameraCapture}>
					Capture
				</button>
				<canvas id="canvas" width="320" height="240" ref={canvasRef}></canvas>
			</header>
		</div>
	);
};
