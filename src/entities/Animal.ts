export class Animal {
	constructor(
		public userId: string, // User associated with animal.
		public kind: string, // Animal kind, eg "corgi", "fireAnt", ...
		public level: number,
		public statPoints: number, // Unspent stat points.
		public skillPoints: number, // Unspent skill points.
		public hp: number, // Current HP, not max HP.
		public sp: number, // Current SP, not max SP.
		public str: number,
		public agi: number,
		public vit: number,
		public int: number,
		public dex: number,
		public luk: number,
		public id?: string // Use undefined for unsaved animals.
	) {}

	clone = () => {
		return new Animal(
			this.userId,
			this.kind,
			this.level,
			this.statPoints,
			this.skillPoints,
			this.hp,
			this.sp,
			this.str,
			this.agi,
			this.vit,
			this.int,
			this.dex,
			this.luk,
			this.id
		);
	};
}
