// Handles the view of the Pocket Animals game.
// https://boardgame.io/documentation/#/
import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import { assert } from './assert';
import { Box, Flex, Grid } from './Box';
import { Entity } from './Entity';
import background from './images/background.png';

interface Moves {
	melee: () => void;
	range: () => void;
	skill: () => void;
	swap: () => void;
}

interface Props {
	G: Entity;
	ctx: any;
	moves: Moves;
	playerID: string; // ID comes from boardgame.io framework. Prefer "id" over "ID" in all other contexts.
	isActive: boolean;
	isMultiplayer: boolean;
	isConnected: boolean;
	isPreview: boolean;
}

export const BattleUi: FunctionComponent<Props> = ({
	G,
	ctx,
	moves,
	playerID,
	isActive,
	isMultiplayer,
	isConnected,
	isPreview
}: Props) => {
	// Get user's in-battle animal.
	const usersAnimals = G.getUsersAnimals(playerID);
	assert(usersAnimals.length, 'User must have one or more animals.', G, ctx, playerID);
	const activeAnimal = usersAnimals.find(animal => G.inBattle.has(animal.id as string));
	assert(activeAnimal?.id, 'User must have an in-battle animal', G, ctx);

	// Get enemy.
	const enemyId = [...G.inBattle].find(id => id !== activeAnimal.id);
	assert(enemyId, 'Battle must have an enemy id.', G, ctx);
	const enemyAnimal = G.animals.get(enemyId as string);
	assert(enemyAnimal?.id, 'Battle must have an enemy.', G, ctx);

	return (
		<Box
			backgroundImage={`url(${background})`}
			backgroundSize="cover"
			backgroundRepeat="no-repeat"
			minHeight="100vh"
			position="relative"
		>
			<Grid
				gridTemplateColumns="repeat(2, 1fr)"
				gridTemplateRows="repeat(2, 1fr)"
				gridColumnGap="0px"
				gridRowGap="16px"
				maxWidth="200px"
			>
				<Box>
					<Button variant="contained" color="primary" onClick={moves.melee}>
						Melee
					</Button>
				</Box>
				<Box>
					<Button variant="contained" color="primary" onClick={moves.range}>
						Range
					</Button>
				</Box>
				<Box>
					<Button variant="contained" color="primary" onClick={moves.skill}>
						Skill
					</Button>
				</Box>
				<Box>
					<Button variant="contained" color="primary" onClick={moves.swap}>
						Swap
					</Button>
				</Box>
			</Grid>
			<Box position="absolute" bottom="0px" width="100%">
				<Flex justifyContent="space-between" maxWidth="784px">
					<Box>
						<Box>
							Hp {activeAnimal.hp} / Sp {activeAnimal.sp}
						</Box>
						<Box>
							<img src={G.sprites.get(activeAnimal.id)?.url} height="160px" />
						</Box>
					</Box>
					<Box>
						<Box>
							Hp {enemyAnimal.hp} / Sp {enemyAnimal.sp}
						</Box>
						<Box>
							<img
								src={G.sprites.get(enemyAnimal.id)?.url}
								height="160px"
								style={{ transform: 'scaleX(-1)' }}
							/>
						</Box>
					</Box>
				</Flex>
			</Box>
		</Box>
	);
};
