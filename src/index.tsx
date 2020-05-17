import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from './debug';
import { Table, User } from './entities';
import { getRandomStatSpread } from './game';
import * as serviceWorker from './serviceWorker';
import { Routing } from './views';

// Setup example data.
// Add user's animal to the battle.
const table = new Table();
const exampleUserId = table.createUser(new User('Erik Lanning')).id as string;
const level = 50;
const statSpread = getRandomStatSpread(level);
table.createAnimal({
	userId: exampleUserId,
	kind: 'goose',
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
const usersAnimals = table.getUsersAnimals(exampleUserId);
assert(usersAnimals[0].id, 'user must have an animal', exampleUserId, table);
table.inBattle.add(usersAnimals[0].id);

// Add enemy animal to the battle.
const dummyUserId = table.createUser({ name: '' }).id as string;
const enemyLevel = 50;
const enemyStats = getRandomStatSpread(enemyLevel);
const enemyAnimal = table.createAnimal({
	userId: dummyUserId,
	kind: 'alligator',
	level: enemyLevel,
	statPoints: 0,
	skillPoints: 0,
	hp: enemyStats.maxHp,
	sp: enemyStats.maxSp,
	str: enemyStats.str,
	agi: enemyStats.agi,
	vit: enemyStats.vit,
	int: enemyStats.int,
	dex: enemyStats.dex,
	luk: enemyStats.luk
});
assert(enemyAnimal.id);
table.inBattle.add(enemyAnimal.id);

ReactDOM.render(
	<React.StrictMode>
		<Routing table={table} currentUserId={exampleUserId} />
	</React.StrictMode>,
	document.querySelector('#root')
);

// Service worker documentation: https://bit.ly/CRA-PWA
serviceWorker.register();
