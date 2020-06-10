import { assert } from '../../debug';

const animationImports = importAll(
	require.context('../../assets/animations', true, /\.(png|jpe?g|svg)$/)
);

function importAll(r: any) {
	return r.keys().reduce((currentFrames: any, nextFrame: any) => {
		const tokens = nextFrame
			.replace('./', '')
			.replace(/\.(png|jpe?g|svg)$/, '')
			.replace(/\d$/, '')
			.split('/'); // Split the name from foo/foo1 to ['foo', 'foo1'];
		const animationName = tokens[0]; // Select the name.
		const index = Number.parseInt(nextFrame.replace(/\D+/g, ''));
		const frameSrc = r(nextFrame);

		if (currentFrames[animationName]) {
			currentFrames[animationName].push([frameSrc, index]);
		} else {
			currentFrames[animationName] = [[frameSrc, index]];
		}

		return currentFrames;
	}, {});
}

const durationPerFrameMsMap = Object.freeze({
	melee: 100,
	ranged: 100,
	lightning: 50
});

const ANIMATION_NAME = 0;
const FRAMES = 1;
const FRAME_SRC = 0;
const FRAME_INDEX = 1;

// Map of animation name to the data src.
// Eg, animation.melee returns the data source for the associated animation.
export const animations: any = Object.freeze({
	...Object.entries(animationImports).reduce((animationMap: any, pair: any) => {
		const animationName = pair[ANIMATION_NAME];
		const durationPerFrameMs = (durationPerFrameMsMap as any)[animationName];

		const frameSrcs = pair[FRAMES].sort(
			(a: any, b: any) => a[FRAME_INDEX] - b[FRAME_INDEX]
		).map((frame: any) => frame[FRAME_SRC]);

		animationMap[animationName] = Object.freeze({
			frameSrcs,
			durationPerFrameMs
		});

		assert(durationPerFrameMs, 'Missing animation frame duration.', animationName);

		return animationMap;
	}, {})
});
