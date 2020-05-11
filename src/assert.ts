// Avoid asserting type checks. TypeScript should be adopted if typing issues frequently arise.
export function assert(condition: any, message: string, ...theArguments: any[]): asserts condition {
	if (!condition) {
		const serializedSpacing = 4; // Use four spaces when printing.
		const additionalInfo =
			theArguments.length !== 0
				? `\nAdditional information:${theArguments.map(
						(x: any) => '\n' + JSON.stringify(x, replacer, serializedSpacing)
				  )}`
				: '';
		throw new Error(`${message}${additionalInfo}`);
	}
}

function replacer(key: any, value: any) {
	// Add more usual javascript built-ins as they come up.
	if (value instanceof Set) return [...value];
	else if (value instanceof Map) return [...value.entries()];
	else return value;
}
