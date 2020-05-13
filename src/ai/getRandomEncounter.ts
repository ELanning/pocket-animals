import { Animal } from '../Animal';
import { sampleIndex } from '../array/sample';
import { getStatCost } from '../levels/getStatCost';
import { totalStatPoints } from '../levels/totalStatPoints';

enum Stats {
	Str,
	Agi,
	Vit,
	Int,
	Dex,
	Luk
}

// Generates a random animal stat spread for a given level.
export function getRandomEncounter(level: number) {
	let availablePoints = totalStatPoints[level];
	let str = 1;
	let agi = 1;
	let vit = 1;
	let int = 1;
	let dex = 1;
	let luk = 1;

	let options = getOptions(availablePoints, str, agi, vit, int, dex, luk);
	while (options.length) {
		const optionIndex = sampleIndex(options);
		switch (optionIndex) {
			case Stats.Str:
				availablePoints -= getStatCost(str);
				str -= 1;
				break;

			case Stats.Agi:
				availablePoints -= getStatCost(str);
				agi -= 1;
				break;

			case Stats.Vit:
				availablePoints -= getStatCost(str);
				vit -= 1;
				break;

			case Stats.Int:
				availablePoints -= getStatCost(str);
				int -= 1;
				break;

			case Stats.Dex:
				availablePoints -= getStatCost(str);
				dex -= 1;
				break;

			case Stats.Luk:
				availablePoints -= getStatCost(str);
				luk -= 1;
				break;

			default:
				throw new RangeError(`Unsupported case: ${optionIndex}`);
		}
		options = getOptions(availablePoints, str, agi, vit, int, dex, luk);
	}

	// TODO.
	const maxHp = 0;
	const maxSp = 0;

	return new Animal('-1', '', level, maxHp, maxSp, str, agi, vit, int, dex, luk);
}

function getOptions(
	points: number,
	str: number,
	agi: number,
	vit: number,
	int: number,
	dex: number,
	luk: number
) {
	return [
		checkIsValid(points, str),
		checkIsValid(points, agi),
		checkIsValid(points, vit),
		checkIsValid(points, int),
		checkIsValid(points, dex),
		checkIsValid(points, luk)
	];
}

function checkIsValid(points: number, stat: number) {
	return points >= getStatCost(stat);
}
