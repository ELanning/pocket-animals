import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createUser, createAnimal } from './Entities';
import { Exploration } from './Exploration';
import { Battle } from './Battle';

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
	const [battleProps, setBattleProps] = useState(null);

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
		setBattleProps({ entities });
		setView('battle');
	};

	let viewComponent = null;
	switch (view) {
		case 'exploration':
			viewComponent = <Exploration onPrediction={handlePrediction} />;
			break;
		case 'battle':
			viewComponent = <Battle {...battleProps} />;
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
