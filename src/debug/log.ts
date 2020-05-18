import { serialize } from './serialize';

const isDebug = false;

export function log(message: string, ...args: any) {
	if (!isDebug) return;

	console.log(message, ...args.map(serialize));
}
