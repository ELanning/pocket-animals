export function sample<T>(array: T[]) {
	return array[sampleIndex(array)];
}

export function sampleIndex<T>(array: T[]) {
	return Math.floor(Math.random() * array.length);
}
