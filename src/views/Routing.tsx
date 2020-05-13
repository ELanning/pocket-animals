import React, { FunctionComponent, useEffect, useState } from 'react';

import { assert } from '../debug/assert';
import { Table } from '../entities/Table';
import { Battle } from './Battle';
import { Exploration } from './Exploration';

interface Props {
	currentUserId: string;
	table: Table;
}

// Handles the transitions between all the various views.
// Avoid putting complicated non-transition logic within this component.
export const Routing: FunctionComponent<Props> = ({ currentUserId, table }) => {
	const currentUser = table.users.get(currentUserId);
	const [view, setView] = useState<string>('loading');
	const [battleProps, setBattleProps] = useState<any>();

	// This block is for debugging purposes only.
	useEffect(() => {
		// Add enemy animal to the battle.
		const dummyUserId = table.createUser({ name: '' }).id as string;
		const enemyAnimal = table.createAnimal({
			userId: dummyUserId,
			kind: 'alligator',
			level: 1,
			statPoints: 0,
			skillPoints: 0,
			hp: 10,
			sp: 10,
			str: 10,
			agi: 10,
			vit: 10,
			int: 10,
			dex: 10,
			luk: 10
		});
		table.inBattle.add(enemyAnimal.id as string);

		// Add users animal to the battle.
		const usersAnimals = table.getUsersAnimals(currentUserId);
		assert(usersAnimals[0].id, 'user must have an animal', currentUserId, table);
		table.inBattle.add(usersAnimals[0].id);

		setBattleProps({ table, currentUserId });
		setView('battle');
	}, [currentUserId, table]);

	const handlePrediction = (predictions: { className: string; probability: number }[]) => {
		setBattleProps({ table, currentUserId });
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

	assert(currentUser, 'Current user must be set.', currentUserId, table);

	return (
		<>
			<div>{currentUser.name}</div>
			{viewComponent}
		</>
	);
};
