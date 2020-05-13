import { serialize } from './serialize';

export function assert(condition: any, message?: string, ...args: any[]): asserts condition {
	if (!condition) {
		const additionalInfo =
			args.length !== 0
				? `\nAdditional information:${args.map((x: any) => '\n' + serialize(x))}`
				: '';
		throw new Error(`${message}${additionalInfo}`);
	}
}
