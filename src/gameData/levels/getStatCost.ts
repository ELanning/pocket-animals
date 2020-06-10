// Calculates the necessary stat points to increase a stat,
// eg agi, str, int, etc.
export function getStatCost(stat: number) {
	return Math.floor((stat - 1) / 10) + 2;
}
