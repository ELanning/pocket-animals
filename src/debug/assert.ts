import { serialize } from './serialize';

export function assert(condition: any, ...args: any[]): asserts condition {
	if (!condition) {
		const message = args.length !== 0 ? args.map((x: any) => serialize(x)).join('\n') : '';
		throw new Error(message);
	}
}
