import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Battle } from './Battle';
import { createAnimal, createUser } from './Entities';
import { Exploration } from './Exploration';

PocketAnimalsApp.propTypes = {
	currentUserId: PropTypes.number.isRequired,
	// See Entities.js for additional documentation.
	entities: PropTypes.shape({
		users: PropTypes.object.isRequired,
		animals: PropTypes.object.isRequired,
		items: PropTypes.object.isRequired
	}).isRequired
};

// Handles the transitions between all the various views.
// Avoid putting complicated non-transition logic within this component.
export function PocketAnimalsApp({ currentUserId, entities }) {
	const currentUser = entities.users[currentUserId];
	const [view, setView] = useState('exploration');
	const [battleProperties, setBattleProperties] = useState();

	const handlePrediction = predictions => {
		const dummyUserId = createUser({ name: '' }).id;
		createAnimal({
			userId: dummyUserId,
			hp: 10,
			sp: 10,
			str: 10,
			agi: 10,
			vit: 10,
			int: 10,
			dex: 10,
			luk: 10
		});
		setBattleProperties({ entities });
		setView('battle');
	};

	let viewComponent = undefined;
	switch (view) {
		case 'exploration':
			viewComponent = <Exploration onPrediction={handlePrediction} />;
			break;

		case 'battle':
			viewComponent = <Battle {...battleProperties} />;
			break;

		default:
			throw new Error(`Unexpected view: ${view}`);
	}

	return (
		<>
			<div>{currentUser.name}</div>
			{viewComponent}
		</>
	);
}
