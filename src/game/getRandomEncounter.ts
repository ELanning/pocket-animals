import { Animal } from '../entities/Animal';
import { sample } from '../extensions/array';
import { getMaxHp, getMaxSp } from './getMax';
import { getStatCost, totalStatPoints } from './levels';

export interface Stats {
	str: number;
	agi: number;
	vit: number;
	int: number;
	dex: number;
	luk: number;
}

// Generates a random animal stat spread for a given level.
export function getRandomEncounter(userId: string, kind: string, level: number) {
	let availablePoints = totalStatPoints[level];
	const stats: Stats = {
		str: 1,
		agi: 1,
		vit: 1,
		int: 1,
		dex: 1,
		luk: 1
	};

	let options: string[];
	do {
		options = getOptions(availablePoints, stats);
		const option = sample(options);
		availablePoints -= getStatCost((stats as any)[option]);
		(stats as any)[option] += 1;
	} while (options.length);

	const maxHp = getMaxHp({ level, vit: stats.vit });
	const maxSp = getMaxSp({ level, int: stats.int });

	return new Animal(
		userId,
		kind,
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

export function getOptions(points: number, stats: Stats) {
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
