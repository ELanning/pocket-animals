/* Contains the global entities of the app.
Understand the design of this pattern before making changes:
https://www.dataorienteddesign.com/dodbook/node5.html */
import { assert } from '../debug';
import { ExtendedMap } from '../extensions';
import { sprite } from '../game/tables/sprite';
import { Animal } from './Animal';
import { Sprite } from './Sprite';
import { User } from './User';

// Treat Entities as a SQL table. When updating, keep entities in 3rd Normal Form.
export class Table {
	users: ExtendedMap<User>;
	animals: ExtendedMap<Animal>;
	sprites: ExtendedMap<Sprite>;
	inBattle: Set<string>;
	benched: Set<string>;
	uuid: number;

	constructor() {
		this.users = new ExtendedMap<User>();
		this.animals = new ExtendedMap<Animal>();
		this.sprites = new ExtendedMap<Sprite>();
		this.inBattle = new Set<string>();
		this.benched = new Set<string>();
		this.uuid = 0;
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

	// Returns a deep copy of the Table.
	// Less efficient than the standard {...foo, bar: {...}} copy method, but more convenient.
	public clone = () => {
		const cloned = new Table();
		cloned.users = new ExtendedMap<User>(
			this.users.asArray().map(user => [user.id as string, user.clone()])
		);
		cloned.animals = new ExtendedMap<Animal>(
			this.animals.asArray().map(animal => [animal.id as string, animal.clone()])
		);
		cloned.sprites = new ExtendedMap<Sprite>(
			this.sprites.asEntryArray().map(([id, sprite]) => [id, sprite.clone()])
		);
		cloned.inBattle = new Set<string>(this.inBattle);
		cloned.benched = new Set<string>(this.benched);
		cloned.uuid = this.uuid;

		return cloned;
	};

	private getUniqueId = () => {
		// (Will likely be a GUID when backend is implemented.)
		return (this.uuid++).toString();
	};

	// Hack so React dev tools work.
	[Symbol.iterator] = () => {
		console.warn('Only iterate on Table for debug purposes. Use clone for a deep copy.');

		function* iter(users: any, animals: any, sprites: any, inBattle: any, uuid: any) {
			yield* [{ users }, { animals }, { sprites }, { inBattle }, { uuid }];
		}

		return iter(this.users, this.animals, this.sprites, this.inBattle, this.uuid);
	};
}
