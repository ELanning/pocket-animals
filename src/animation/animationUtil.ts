import { assert } from '../debug';

export function createText(
	text: string,
	selector: string, // Valid selector formats: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
	classNames: string[], // Use ["foo", "bar"] NOT [".foo", ".bar"].
	durationMs: number // In milliseconds.
) {
	const textDiv = document.createElement('div');
	textDiv.className = classNames.join(' ');

	const t = document.createTextNode(text);
	textDiv.append(t);

	const target = document.querySelector(selector);
	if (target) {
		target.before(textDiv);
		return new Promise(resolve => {
			setTimeout(() => {
				textDiv.remove();
				resolve();
			}, durationMs);
		});
	} else {
		return Promise.resolve();
	}
}

export function createAnimation(
	frameSrcs: string[],
	selector: string, // Valid selector formats: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
	classNames: string[], // Use ["foo", "bar"] NOT [".foo", ".bar"].
	durationPerFrameMs: number // In milliseconds.
) {
	assert(frameSrcs.length !== 0);

	const imageDiv = document.createElement('div');
	imageDiv.className = classNames.join(' ');

	const image = document.createElement('img');
	imageDiv.append(image);

	const target = document.querySelector(selector);
	if (target) {
		target.before(imageDiv);
		const firstFrameIndex = 0;
		return new Promise(resolve => {
			playFrameSequence(
				imageDiv,
				image,
				frameSrcs,
				firstFrameIndex,
				durationPerFrameMs,
				resolve
			);
		});
	} else {
		return Promise.resolve();
	}
}

function playFrameSequence(
	imageDiv: HTMLDivElement,
	image: HTMLImageElement,
	frameSrcs: string[],
	currentFrameIndex: number,
	durationPerFrameMs: number,
	resolve: () => void
) {
	setTimeout(() => {
		const isSequenceDone = currentFrameIndex === frameSrcs.length;
		if (isSequenceDone) {
			imageDiv.remove();
			resolve();
		} else {
			image.src = frameSrcs[currentFrameIndex];
			const nextFrame = currentFrameIndex + 1;
			playFrameSequence(imageDiv, image, frameSrcs, nextFrame, durationPerFrameMs, resolve);
		}
	}, durationPerFrameMs);
}
