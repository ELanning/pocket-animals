// Key-value map, with convenience functions.
export class ExtendedMap<V> extends Map<string, V> {
	asArray = () => {
		// Should arguably be this.entries(), but this.values() has had more practical value.
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
