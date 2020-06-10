import React, { FunctionComponent, useEffect, useState } from 'react';

import { assert } from '../debug/assert';
import { Game } from '../entities';
import { Box } from '../ui';
import { Battle } from './battle/Battle';
import { Exploration } from './Exploration';

interface Props {
	currentUserId: string;
	game: Game;
}

// Handles the transitions between all the various views.
// Avoid putting complicated non-transition logic within this component.
export const Routing: FunctionComponent<Props> = ({ currentUserId, game }) => {
	const currentUser = game.users.get(currentUserId);
	const [view, setView] = useState<string>('loading');
	const [props, setProps] = useState<any>();

	// This block is for debugging purposes only.
	useEffect(() => {
		setProps({ game, currentUserId });
		setView('battle');
	}, [currentUserId, game]);

	const handlePrediction = (predictions: { className: string; probability: number }[]) => {
		setProps({ game, currentUserId });
		setView('battle');
	};

	let viewComponent = undefined;
	switch (view) {
		case 'exploration':
			viewComponent = <Exploration onPrediction={handlePrediction} />;
			break;

		case 'battle':
			viewComponent = <Battle {...props} />;
			break;

		case 'loading':
			break;

		default:
			throw new Error(`Unexpected view: ${view}`);
	}

	assert(currentUser, 'Current user must be set.', currentUserId, game);

	return <Box maxWidth="700px">{viewComponent}</Box>;
};
