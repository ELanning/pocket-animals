// Avoid asserting type checks. TypeScript should be adopted if typing issues frequently arise.
export function assert(condition: any, message: string, ...theArguments: any): asserts condition {
	if (!Boolean(condition)) {
		const additionalInfo =
			theArguments.length !== 0
				? `\nAdditional information:${theArguments.map(
						(x: any) => '\n' + JSON.stringify(x, replacer, 2)
				  )}`
				: '';
		throw new Error(`${message}${additionalInfo}`);
	}
}

function replacer(key: any, value: any) {
	// Add more usual javascript built-ins as they come up.
	return value instanceof Set ? [...value] : value;
}
