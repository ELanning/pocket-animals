// TODO: Switch these to dynamic imports, to avoid writing boilerplate.
import alligator from '../../images/alligator.png';
import corgi from '../../images/corgi.png';
import duck from '../../images/duck.png';
import rabbit from '../../images/rabbit.png';

// The sprite to use for a given animal kind.
// Eg sprite[corgi] == url to the asset.
export const sprite: any = Object.freeze({
	corgi,
	duck,
	rabbit,
	alligator
});
