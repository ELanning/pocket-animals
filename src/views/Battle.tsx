import { MCTSBot } from 'boardgame.io/ai';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import React, { FunctionComponent } from 'react';

import { assert } from '../debug/assert';
import { Table } from '../entities/Table';
import { createBattleState } from '../game/createBattleState';
import { BattleUi } from './BattleUi';

interface Props {
	currentUserId: string;
	table: Table;
}

// Sets up the view and state of the game.
export const Battle: FunctionComponent<Props> = ({ currentUserId, table }: Props) => {
	const enemyId = table.users.asArray().find(user => user.id !== currentUserId)?.id;
	assert(enemyId, 'Game must have an enemy', table);

	// Warning: Game state data will not show up in debug panel,
	// due to Sets and Maps not being serialized by boardgame.io's JSON.stringify call.
	const BattleClient = Client({
		game: createBattleState(table),
		board: BattleUi,
		numPlayers: 2,
		multiplayer: Local({
			bots: { [enemyId]: MCTSBot }
		}),
		debug: false
	});

	return <BattleClient gameID="single" playerID={currentUserId.toString()} />;
};
