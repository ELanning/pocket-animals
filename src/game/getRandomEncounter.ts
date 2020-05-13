import { Animal } from '../entities/Animal';
import { sample } from '../extensions/array';
import { getStatCost } from './levels/getStatCost';
import { totalStatPoints } from './levels/totalStatPoints';

export interface Stats {
	str: number;
	agi: number;
	vit: number;
	int: number;
	dex: number;
	luk: number;
}

// Generates a random animal stat spread for a given level.
export function getRandomEncounter(level: number) {
	let availablePoints = totalStatPoints[level];
	const stats: Stats = {
		str: 1,
		agi: 1,
		vit: 1,
		int: 1,
		dex: 1,
		luk: 1
	};

	const options = getOptions(availablePoints, stats);
	while (options.length) {
		const option = sample(options);
		availablePoints -= getStatCost((stats as any)[option]);
		(stats as any)[option] += 1;
	}

	// TODO.
	const maxHp = 0;
	const maxSp = 0;

	return new Animal(
		'-1',
		'',
		level,
		0,
		0,
		maxHp,
		maxSp,
		stats.str,
		stats.agi,
		stats.vit,
		stats.int,
		stats.dex,
		stats.luk
	);
}

function getOptions(points: number, stats: Stats) {
	const options = [];
	if (checkIsOption(points, stats.str)) options.push('str');
	if (checkIsOption(points, stats.agi)) options.push('agi');
	if (checkIsOption(points, stats.vit)) options.push('vit');
	if (checkIsOption(points, stats.int)) options.push('int');
	if (checkIsOption(points, stats.dex)) options.push('dex');
	if (checkIsOption(points, stats.luk)) options.push('luk');
	return options;
}

function checkIsOption(points: number, stat: number) {
	return points >= getStatCost(stat);
}
