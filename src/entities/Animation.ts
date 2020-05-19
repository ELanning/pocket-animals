export class Animation {
	constructor(
		public targetId: string, // Target of the animation, could be an animal, a location on the screen, etc.
		public url: string, // Url to the animation asset.
		public durationMs?: string // Length of the animation in milliseconds. Use undefined for infinite loops.
	) {}

	clone = () => {
		return new Animation(this.targetId, this.url, this.durationMs);
	};
}
