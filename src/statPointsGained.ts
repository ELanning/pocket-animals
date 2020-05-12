import { totalStatPoints } from './totalStatPoints';

// Insert 0 for level 0. This makes indexing into the array easier.
// Eg statPointsGained[3] for level 3 instead of statPointsGained[2].
const statPointsGained = [0];
for (let level = 1; level < totalStatPoints.length - 1; level++) {
	statPointsGained.push(totalStatPoints[level + 1] - totalStatPoints[level]);
}

export { statPointsGained };
