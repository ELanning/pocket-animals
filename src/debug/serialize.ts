export function serialize(object: any) {
	const serializedSpacing = 4; // Use four spaces when printing.
	return JSON.stringify(object, replacer, serializedSpacing);
}

function replacer(key: any, value: any) {
	// Add more usual javascript built-ins as they come up.
	if (value instanceof Set) return [...value];
	else if (value instanceof Map) return [...value.entries()];
	else return value;
}
