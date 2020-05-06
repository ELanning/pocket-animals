// Contains the global entities of the app.
// Understand the design of this pattern before making changes:
// https://www.dataorienteddesign.com/dodbook/node5.html
import { Animal } from './Animal';
import { User } from './User';

let uuid = 0;

export const Entities = Object.freeze({
	users: {},
	animals: {},
	items: {},
	getUniqueId: function () {
		return uuid++;
	}
});

export function createUser({ name, profileUrl }) {
	const id = Entities.getUniqueId();
	Entities.users[id] = new User({ id, name, profileUrl });
	return Entities.users[id];
}

export function createAnimal({ userId, hp, sp, str, agi, vit, int, dex, luk }) {
	const id = Entities.getUniqueId();
	Entities.animals[id] = new Animal({ id, userId, hp, sp, str, agi, vit, int, dex, luk });
	return Entities.animals[id];
}

export function createItem() {
	throw new Error('not implemented');
}
