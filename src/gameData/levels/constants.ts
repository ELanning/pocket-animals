import { assert } from '../../debug/assert';
import { statPointsGained } from './statPointsGained';
import { totalStatPoints } from './totalStatPoints';

export const maxLevel = 100;
export const minLevel = 1;

assert(statPointsGained[maxLevel - 1], 'statPointsGained is missing second to last level'); // Subtract one because maxLevel cannot level up.
assert(statPointsGained[minLevel], 'statPointsGained is missing minLevel');
assert(totalStatPoints[maxLevel], 'totalStatPoints is missing maxLevel');
assert(totalStatPoints[minLevel], 'totalStatPoints is missing minLevel');
