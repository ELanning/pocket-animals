import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from './debug';
import { Table, User } from './entities';
import { getRandomStatSpread } from './game';
import * as serviceWorker from './serviceWorker';
import { Routing } from './views';

// Setup example data.
const table = new Table();

// Create user data.
const userId = table.createUser(new User('Erik Lanning')).id as string;
const userLevel = 50;
createRandomAnimal(userLevel, userId, 'goose');
const animal2 = createRandomAnimal(userLevel, userId, 'corgi');
const animal3 = createRandomAnimal(userLevel, userId, 'hamster');
const usersAnimals = table.getUsersAnimals(userId);
assert(usersAnimals[0].id, 'user must have an animal', userId, table);

// Add user's animals to battle/bench.
table.inBattle.add(usersAnimals[0].id);
table.benched.add(animal2.id as string);
table.benched.add(animal3.id as string);

// Create enemy data.
const dummyUserId = table.createUser({ name: '' }).id as string;
const enemyLevel = 50;
const enemyAnimal = createRandomAnimal(enemyLevel, dummyUserId, 'alligator');
assert(enemyAnimal.id);

// Add enemy's animal to battle.
table.inBattle.add(enemyAnimal.id);

function createRandomAnimal(level: number, userId: string, animalKind: string) {
	const statSpread = getRandomStatSpread(level);
	return table.createAnimal({
		userId,
		kind: animalKind,
		level: level,
		skillPoints: 0,
		statPoints: 0,
		hp: statSpread.maxHp,
		sp: statSpread.maxSp,
		str: statSpread.str,
		agi: statSpread.agi,
		vit: statSpread.vit,
		int: statSpread.int,
		dex: statSpread.dex,
		luk: statSpread.luk
	});
}

ReactDOM.render(
	<React.StrictMode>
		<Routing table={table} currentUserId={userId} />
	</React.StrictMode>,
	document.querySelector('#root')
);

// Service worker documentation: https://bit.ly/CRA-PWA
serviceWorker.register();
