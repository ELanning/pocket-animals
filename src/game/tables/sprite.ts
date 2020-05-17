const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|svg)$/));

const ANIMAL_NAME = 0;
const DATA_SRC = 1;
function importAll(r: any) {
	return r.keys().map((key: any) => {
		const animalName = key.replace('./', '').replace(/\.(png|jpe?g|svg)$/, '');
		return [animalName, r(key)];
	});
}

// The sprite to use for a given animal kind.
// Eg sprite[corgi] == url to the asset or the image data stream.
export const sprite: any = Object.freeze({
	...images.reduce((spriteMap: any, spritePair: any) => {
		const animalName = spritePair[ANIMAL_NAME];
		const dataSrc = spritePair[DATA_SRC];

		spriteMap[animalName] = dataSrc;

		return spriteMap;
	}, {})
});
