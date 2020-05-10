import React, { FunctionComponent } from 'react';
// @ts-ignore
import { Debug } from 'boardgame.io/debug';
import { Client } from 'boardgame.io/react';

import { Entity } from './Entity';
import { BattleUi } from './BattleUi';
import { createBattleState } from './createBattleState';

interface Props {
	currentUserId: string;
	// See Entities.js for additional documentation.
	entity: Entity;
}

// Sets up the view and state of the game.
export const Battle: FunctionComponent<Props> = ({ currentUserId, entity }: Props) => {
	const BattleClient = Client({
		game: createBattleState({ ...entity }),
		board: BattleUi,
		debug: { impl: Debug }
	});

	return <BattleClient gameID="single" playerID={currentUserId.toString()} />;
};
