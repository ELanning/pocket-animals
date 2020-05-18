export class Sprite {
	// May eventually hold opacity/metadata/rotation etc.
	// Minorly breaking YAGNI.
	constructor(public url: string) {}

	clone = () => {
		return new Sprite(this.url);
	};
}
