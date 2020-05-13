import { getRandomEncounter } from '../game/getRandomEncounter';
import { maxLevel, minLevel } from '../game/levels/constants';

it('spends all available stat points', () => {
	for (let level = minLevel; level < maxLevel + 1; level++) {
		const randomEncounter = getRandomEncounter(level);
	}
});
