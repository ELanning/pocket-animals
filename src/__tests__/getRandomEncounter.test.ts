import { getOptions, getRandomEncounter } from '../game/getRandomEncounter';
import { maxLevel, minLevel } from '../game/levels/constants';

it('spends all available stat points', () => {
	const fakeId = '1';
	const kind = 'corgi';

	const randomEncounter1 = getRandomEncounter(fakeId, kind, minLevel);
	const options1 = getOptions(randomEncounter1.statPoints, randomEncounter1);
	expect(options1.length).toEqual(0);

	const randomEncounter2 = getRandomEncounter(fakeId, kind, maxLevel);
	const options2 = getOptions(randomEncounter2.statPoints, randomEncounter2);
	expect(options2.length).toEqual(0);
});
