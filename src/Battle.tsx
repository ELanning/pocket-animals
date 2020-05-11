import { Debug } from 'boardgame.io/debug';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import React, { FunctionComponent } from 'react';

import { assert } from './assert';
import { BattleUi } from './BattleUi';
import { createBattleState } from './createBattleState';
import { Entity } from './Entity';

interface Props {
	currentUserId: string;
	entity: Entity;
}

// Sets up the view and state of the game.
export const Battle: FunctionComponent<Props> = ({ currentUserId, entity }: Props) => {
	// Warning: Game state data will not show up in debug panel,
	// due to Sets and Maps not being serialized by boardgame.io's JSON.stringify call.
	const BattleClient = Client({
		game: createBattleState(entity),
		board: BattleUi,
		debug: { impl: Debug },
		numPlayers: 2,
		multiplayer: Local()
	});

	const enemyId = entity.users.asArray().find(user => user.id !== currentUserId)?.id;
	assert(enemyId, 'Game must have an enemy', entity);

	return (
		<>
			<BattleClient gameID="single" playerID={currentUserId.toString()} />
			<BattleClient gameID="single" playerID={enemyId} />
		</>
	);
};
