import { assert } from '../debug/assert';

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
	) {
		// TODO: Assert kind is valid.
		assert(Number.isInteger(level), '', level);
		assert(Number.isInteger(statPoints), '', statPoints);
		assert(Number.isInteger(skillPoints), '', skillPoints);
		assert(Number.isInteger(hp), '', hp);
		assert(Number.isInteger(sp), '', sp);
		assert(Number.isInteger(str), '', str);
		assert(Number.isInteger(agi), '', agi);
		assert(Number.isInteger(vit), '', vit);
		assert(Number.isInteger(int), '', int);
		assert(Number.isInteger(dex), '', dex);
		assert(Number.isInteger(luk), '', luk);
	}

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
