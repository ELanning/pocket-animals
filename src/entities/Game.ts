/* Contains the global entities of the app.
Understand the design of this pattern before making changes:
https://www.dataorienteddesign.com/dodbook/node5.html */
import { assert } from '../debug';
import { ExtendedMap } from '../extensions';
// TODO: Move this out of this file.
import { sprites } from '../gameLogic/tables/sprites';
import { Animal } from './Animal';
import { Animation } from './Animation';
import { Skill } from './Skill';
import { Sprite } from './Sprite';
import { User } from './User';

type TurnDamage = {
	id: string; // Entity id.
	amount: number; // Amount of damage taken.
};

export class Game {
	// Treat Entities as a SQL table. When updating, keep entities in 3rd Normal Form.
	public users: ExtendedMap<User>;
	public animals: ExtendedMap<Animal>;
	public sprites: ExtendedMap<Sprite>;
	public animations: Array<Animation>;
	public skills: Array<Skill>;
	public previousTurnDamage: Array<TurnDamage>;
	public inBattle: Set<string>;
	public benched: Set<string>;
	public uuid: number;

	constructor() {
		this.users = new ExtendedMap<User>();
		this.animals = new ExtendedMap<Animal>();
		this.sprites = new ExtendedMap<Sprite>();
		this.animations = new Array<Animation>();
		this.skills = new Array<Skill>();
		this.previousTurnDamage = new Array<TurnDamage>();
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
		this.sprites.set(id, new Sprite(sprites[animal.kind]));

		return this.animals.get(id) as Animal;
	};

	// Returns a deep copy of the Table.
	// Less efficient than the standard {...foo, bar: {...}} copy method, but more convenient.
	public clone = () => {
		const cloned = new Game();
		cloned.users = new ExtendedMap<User>(
			this.users.asArray().map(user => [user.id as string, user.clone()])
		);
		cloned.animals = new ExtendedMap<Animal>(
			this.animals.asArray().map(animal => [animal.id as string, animal.clone()])
		);
		cloned.sprites = new ExtendedMap<Sprite>(
			this.sprites.asEntryArray().map(([id, sprite]) => [id, sprite.clone()])
		);
		cloned.animations = new Array<Animation>(
			...this.animations.map(animation => animation.clone())
		);
		cloned.previousTurnDamage = new Array<TurnDamage>(
			...this.previousTurnDamage.map(turnDamage => ({
				amount: turnDamage.amount,
				id: turnDamage.id
			}))
		);
		cloned.skills = new Array<Skill>(...this.skills.map(skill => skill.clone()));
		cloned.inBattle = new Set<string>(this.inBattle);
		cloned.benched = new Set<string>(this.benched);
		cloned.uuid = this.uuid;

		Game.assertCloneSucceeded(cloned, this);

		return cloned;
	};

	private getUniqueId = () => {
		// (Will likely be a GUID when backend is implemented.)
		return (this.uuid++).toString();
	};

	// Forgetting to update the clone method when adding new properties is common.
	// This function helps mitigate such issues.
	// It is not a perfect check, but should cover the above case.
	private static assertCloneSucceeded(a: any, b: any) {
		for (const key of Object.keys(a)) {
			if (a[key] instanceof Set) assert(a.size === b.size);
			else if (a[key] instanceof Map) assert(a.size === b.size);
			else if (Array.isArray(a[key])) assert(a.length === b.length);
			else if (typeof a[key] === 'number') assert(a[key] === b[key]);
			else if (typeof a[key] === 'function') assert(a[key] !== b[key]);
			else
				throw new TypeError(
					`Unknown type detected: ${typeof a[key]} ${key}. Update assertCloneSucceeded.`
				);
		}
	}

	// Hack so React dev tools properly display the properties.
	[Symbol.iterator] = () => {
		console.warn('Only iterate on Table for debug purposes. Use clone for a deep copy.');

		function* iter(
			users: any,
			animals: any,
			sprites: any,
			animations: any,
			skills: any,
			previousTurnDamage: any,
			inBattle: any,
			uuid: any
		) {
			yield* [
				{ users },
				{ animals },
				{ sprites },
				{ animations },
				{ skills },
				{ previousTurnDamage },
				{ inBattle },
				{ uuid }
			];
		}

		return iter(
			this.users,
			this.animals,
			this.sprites,
			this.animations,
			this.skills,
			this.previousTurnDamage,
			this.inBattle,
			this.uuid
		);
	};
}
