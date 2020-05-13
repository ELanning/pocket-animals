// Contains the global entities of the app.
// Understand the design of this pattern before making changes:
// https://www.dataorienteddesign.com/dodbook/node5.html
import { Animal } from './Animal';
import { assert } from './assert';
import { Sprite } from './Sprite';
import { sprite } from './tables/sprite';
import { User } from './User';

// Treat Entities as a SQL table. When updating, keep entities in 3rd Normal Form.
export class Entity {
	users: ExtendedMap<User>;
	animals: ExtendedMap<Animal>;
	sprites: ExtendedMap<Sprite>;
	inBattle: Set<string>;
	#uuid: number;

	constructor() {
		this.users = new ExtendedMap<User>();
		this.animals = new ExtendedMap<Animal>();
		this.sprites = new ExtendedMap<Sprite>();
		this.inBattle = new Set<string>();
		this.#uuid = 0;
	}

	public getUsersAnimals = (userId: string) => {
		return this.animals.asArray().filter(animal => userId === animal.userId);
	};

	// Add to user map and update id.
	public createUser = (user: User) => {
		assert(!user.id, 'user must not have an id.', user);

		const id = this.getUniqueId();
		user.id = id;
		this.users.set(id, user);

		return this.users.get(id) as User;
	};

	// Add to animal map and update id.
	public createAnimal = (animal: Animal) => {
		assert(!animal.id, 'animal must not have an id.', animal);

		const id = this.getUniqueId();
		animal.id = id;
		this.animals.set(id, animal);
		this.sprites.set(id, new Sprite(sprite[animal.kind]));

		return this.animals.get(id) as Animal;
	};

	private getUniqueId = () => {
		// (Will likely be a GUID when backend is implemented.)
		return (this.#uuid++).toString();
	};

	[Symbol.iterator] = () => {
		// Log instead of throw.
		// Throwing causes issues with React debug tools.
		console.error('Do not iterate on Entity. Prefer mutation.');
	};
}

// Key-value map, with convenience functions.
class ExtendedMap<V> extends Map<string, V> {
	asArray = () => {
		return [...this.values()];
	};

	asIdArray = () => {
		return [...this.keys()];
	};

	asIdSet = () => new Set(this.asIdArray());

	[Symbol.iterator] = () => {
		return this.entries();
	};
}
