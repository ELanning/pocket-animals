import { serialize } from './serialize';

// Avoid asserting type checks. TypeScript should be adopted if typing issues frequently arise.
export function assert(condition: any, message: string, ...theArguments: any[]): asserts condition {
	if (!condition) {
		const additionalInfo =
			theArguments.length !== 0
				? `\nAdditional information:${theArguments.map((x: any) => '\n' + serialize(x))}`
				: '';
		throw new Error(`${message}${additionalInfo}`);
	}
}
