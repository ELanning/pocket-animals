import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from './debug';
import { Animal, Game, Skill, User } from './entities';
import { getRandomStatSpread, SkillName } from './gameData';
import * as serviceWorker from './serviceWorker';
import { Routing } from './views';

// Setup example data.
const game = new Game();

// Create user data.
const userId = game.createUser(new User('Erik Lanning')).id as string;
const userLevel = 50;
const animal1 = createRandomAnimal(userLevel, userId, 'goose');
game.skills.push(new Skill(animal1.id as string, SkillName.Lightning));
const animal2 = createRandomAnimal(userLevel, userId, 'corgi');
const animal3 = createRandomAnimal(userLevel, userId, 'hamster');
const usersAnimals = game.getUsersAnimals(userId);
assert(usersAnimals[0].id, 'user must have an animal', userId, game);

// Add user's animals to battle/bench.
game.inBattle.add(usersAnimals[0].id);
game.benched.add(animal2.id as string);
game.benched.add(animal3.id as string);

// Create enemy data.
const dummyUserId = game.createUser(new User('')).id as string;
const enemyLevel = 50;
const enemyAnimal = createRandomAnimal(enemyLevel, dummyUserId, 'alligator');
assert(enemyAnimal.id);

// Add enemy's animal to battle.
game.inBattle.add(enemyAnimal.id);

function createRandomAnimal(level: number, userId: string, animalKind: string) {
	const statSpread = getRandomStatSpread(level);
	return game.createAnimal(
		new Animal(
			userId,
			animalKind,
			level,
			0,
			0,
			statSpread.maxHp,
			statSpread.maxSp,
			statSpread.str,
			statSpread.agi,
			statSpread.vit,
			statSpread.int,
			statSpread.dex,
			statSpread.luk
		)
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Routing game={game} currentUserId={userId} />
	</React.StrictMode>,
	document.querySelector('#root')
);

// Service worker documentation: https://bit.ly/CRA-PWA
serviceWorker.register();
