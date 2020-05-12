import { statPointsGained } from './statPointsGained';
// The number of total stat points at a given level.
// Eg a level 10 animal has totalStatPoints[10] == 80 total stat points.
// 0 is inserted such that totalStatPoints can be indexed into easily, eg totalStatPoints[3] for level 3 instead of totalStatPoints[2].
const totalStatPoints = [0];

let runningTotal = 48; // All animals start with a base of 48 stat points.
for (const statPoints of statPointsGained) {
	totalStatPoints.push(runningTotal);
	runningTotal += statPoints;
}

export { totalStatPoints };
