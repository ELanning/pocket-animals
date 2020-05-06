import { Debug } from 'boardgame.io/debug';
import { Client } from 'boardgame.io/react';
import PropTypes from 'prop-types';
import React from 'react';

import { BattleUi } from './BattleUi';
import { createBattleState } from './createBattleState';

Battle.propTypes = {
	// See Entities.js for additional documentation.
	entities: PropTypes.shape({
		users: PropTypes.object.isRequired,
		animals: PropTypes.object.isRequired,
		items: PropTypes.object.isRequired
	}).isRequired
};

export function Battle({ entities }) {
	const BattleClient = Client({
		game: createBattleState(entities),
		board: BattleUi,
		debug: { impl: Debug }
	});

	return (
		<div>
			<h1>Battle</h1>
			<BattleClient gameID="single" />
		</div>
	);
}
