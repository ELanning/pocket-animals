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
	const [props, setProps] = useState<any>();

	// This block is for debugging purposes only.
	useEffect(() => {
		setProps({ table, currentUserId });
		setView('battle');
	}, [currentUserId, table]);

	const handlePrediction = (predictions: { className: string; probability: number }[]) => {
		setProps({ table, currentUserId });
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

	assert(currentUser, 'Current user must be set.', currentUserId, table);

	return <>{viewComponent}</>;
};
