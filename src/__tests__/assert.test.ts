import { assert } from '../assert';

it('properly serializes', () => {
	// Could be many subtests, but would require more boilerplate, for diminishing returns.
	const exampleObject = {
		nestedSet: {
			set: new Set(['setItem1', 'setItem2', 'setItem3', 'setItem4', 'setItem5'])
		},
		nestedMap: {
			map: new Map([
				['key1', 'value1'],
				['key2', 'value2']
			])
		},
		anArray: ['arrayItem1', 'arrayItem2']
	};

	try {
		assert(false, '', exampleObject);
	} catch (error) {
		// Verify nested set.
		expect(error.message).toContain('set');
		expectToContain(error.message, 'setItem1', 'setItem2', 'setItem3', 'setItem4', 'setItem5');

		// Verify nested map.
		expect(error.message).toContain('map');
		expectToContain(error.message, 'key1', 'value1');
		expectToContain(error.message, 'key2', 'value2');

		// Verify the array.
		expect(error.message).toContain('anArray');
		expectToContain(error.message, 'arrayItem1', 'arrayItem2');
	}
});

function expectToContain(string: string, ...strings: string[]) {
	for (const s of strings) {
		expect(string).toContain(s);
	}
}
