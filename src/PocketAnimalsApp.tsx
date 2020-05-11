import React, { FunctionComponent, useEffect, useState } from 'react';

import { assert } from './assert';
import { Battle } from './Battle';
import { Entity } from './Entity';
import { Exploration } from './Exploration';

interface Props {
	currentUserId: string;
	entity: Entity;
}

// Handles the transitions between all the various views.
// Avoid putting complicated non-transition logic within this component.
export const PocketAnimalsApp: FunctionComponent<Props> = ({ currentUserId, entity }) => {
	const currentUser = entity.users.get(currentUserId);
	const [view, setView] = useState<string>('loading');
	const [battleProps, setBattleProps] = useState<any>();

	// This block is for debugging purposes only.
	useEffect(() => {
		// Add enemy animal to the battle.
		const dummyUserId = entity.createUser({ name: '' }).id as string;
		const enemyAnimal = entity.createAnimal({
			userId: dummyUserId,
			level: 1,
			hp: 10,
			sp: 10,
			str: 10,
			agi: 10,
			vit: 10,
			int: 10,
			dex: 10,
			luk: 10
		});
		entity.inBattle.add(enemyAnimal.id as string);

		// Add users animal to the battle.
		const usersAnimals = entity.getUsersAnimals(currentUserId);
		assert(usersAnimals[0].id, 'user must have an animal', currentUserId, entity);
		entity.inBattle.add(usersAnimals[0].id);

		setBattleProps({ entity, currentUserId });
		setView('battle');
	}, [currentUserId, entity]);

	const handlePrediction = (predictions: { className: string; probability: number }[]) => {
		setBattleProps({ entity, currentUserId });
		setView('battle');
	};

	let viewComponent = undefined;
	switch (view) {
		case 'exploration':
			viewComponent = <Exploration onPrediction={handlePrediction} />;
			break;

		case 'battle':
			viewComponent = <Battle {...battleProps} />;
			break;

		case 'loading':
			break;

		default:
			throw new Error(`Unexpected view: ${view}`);
	}

	assert(currentUser, 'Current user must be set.', currentUserId, entity);

	return (
		<>
			<div>{currentUser.name}</div>
			{viewComponent}
		</>
	);
};
