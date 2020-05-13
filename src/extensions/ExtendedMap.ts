// Key-value map, with convenience functions.
export class ExtendedMap<V> extends Map<string, V> {
	asArray = () => {
		return [...this.values()];
	};

	asIdArray = () => {
		return [...this.keys()];
	};

	asIdSet = () => new Set(this.asIdArray());

	[Symbol.iterator] = () => {
		return this.entries();
	};
}
