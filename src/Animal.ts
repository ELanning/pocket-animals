import { assert } from './assert';

export class Animal {
	constructor(
		public userId: string,
		public level: number,
		public hp: number,
		public sp: number,
		public str: number,
		public agi: number,
		public vit: number,
		public int: number,
		public dex: number,
		public luk: number,
		public id?: string // Use undefined for unsaved animals.
	) {
		assert(Number.isInteger(level), '', this);
		assert(Number.isInteger(hp), '', this);
		assert(Number.isInteger(sp), '', this);
		assert(Number.isInteger(str), '', this);
		assert(Number.isInteger(agi), '', this);
		assert(Number.isInteger(vit), '', this);
		assert(Number.isInteger(int), '', this);
		assert(Number.isInteger(dex), '', this);
		assert(Number.isInteger(luk), '', this);
	}
}
