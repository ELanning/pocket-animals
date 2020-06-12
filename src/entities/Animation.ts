export class Animation {
	constructor(
		public name: string, // Unique name of the animation. Should be camel case, eg 'lightning', 'fireBlast', etc.
		public targetId: string, // Target of the animation, could be an animal, a location on the screen, etc.
		public frameSrcs: string[], // list of frame srcs of the animation asset.
		public frameDurationMs: number // Length of each frame of the animation in milliseconds.
	) {}

	clone = () => {
		return new Animation(this.name, this.targetId, this.frameSrcs, this.frameDurationMs);
	};
}
