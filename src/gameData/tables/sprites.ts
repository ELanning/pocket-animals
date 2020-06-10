const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|svg)$/));

function importAll(r: any) {
	return r.keys().map((key: any) => {
		const animalName = key.replace('./', '').replace(/\.(png|jpe?g|svg)$/, '');
		const dataSrc = r(key);
		return [animalName, dataSrc];
	});
}

const ANIMAL_NAME = 0;
const DATA_SRC = 1;

// The sprite to use for a given animal kind.
// Eg sprite.corgi returns the url to the asset or the image data stream.
// Could be used in React as <img src={sprite.corgi} />.
export const sprites: any = Object.freeze({
	...images.reduce((spriteMap: any, spritePair: any) => {
		const animalName = spritePair[ANIMAL_NAME];
		const dataSrc = spritePair[DATA_SRC];

		spriteMap[animalName] = dataSrc;

		return spriteMap;
	}, {})
});
