import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import React, { FunctionComponent } from 'react';

import { assert } from '../../debug/assert';
import { Game } from '../../entities/Game';
import { createBattleState, createBot } from '../../gameLogic';
import { BattleUi } from './BattleUi';

interface Props {
	currentUserId: string;
	game: Game;
}

// Sets up the view and state of the game.
export const Battle: FunctionComponent<Props> = ({ currentUserId, game: table }: Props) => {
	const enemyId = table.users.asArray().find(user => user.id !== currentUserId)?.id;
	assert(enemyId, 'Game must have an enemy', table);

	// Warning: Game state data will not show up in debug panel,
	// due to Sets and Maps not being serialized by boardgame.io's JSON.stringify call.
	const BattleClient = Client({
		game: createBattleState(table),
		board: BattleUi,
		numPlayers: 2,
		multiplayer: Local({
			bots: { [enemyId]: createBot }
		}),
		debug: false
	});

	return <BattleClient gameID="single" playerID={currentUserId.toString()} />;
};
