import * as mobileNet from '@tensorflow-models/mobilenet';
import PropTypes from 'prop-types';
import React from 'react';

import { useVideoCapture } from './useVideoCapture';

// Start model loading as soon as possible to reduce upfront cost.
const mobileNetPromise = mobileNet.load();

Exploration.propTypes = {
	onPrediction: PropTypes.func.isRequired
};

export function Exploration({ onPrediction }) {
	const { videoRef, canvasRef, takeCameraSnap } = useVideoCapture();

	const handleCameraCapture = async () => {
		takeCameraSnap();
		const model = await mobileNetPromise;
		const predictions = await model.classify(canvasRef.current);
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
}
