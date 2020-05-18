// Handles the view of the Pocket Animals game.
// https://boardgame.io/documentation/#/
import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import background from '../assets/images/background.png';
import { assert } from '../debug/assert';
import { Animal, Sprite, Table } from '../entities';
import { Box, Flex, Grid } from '../ui/Box';

interface Moves {
	melee: () => void;
	range: () => void;
	skill: () => void;
	swap: () => void;
}

interface Props {
	G: Table;
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

	const benchedAnimals = usersAnimals.filter(animal => G.benched.has(animal.id as string));
	const swapOptions = benchedAnimals.map(benched => {
		assert(benched.id);
		const sprite = G.sprites.get(benched.id);
		assert(sprite);
		return [benched, sprite] as [Animal, Sprite];
	});

	// Get enemy.
	const enemyId = [...G.inBattle].find(id => id !== activeAnimal.id);
	assert(enemyId, 'Battle must have an enemy id.', G, ctx);
	const enemyAnimal = G.animals.get(enemyId as string);
	assert(enemyAnimal?.id, 'Battle must have an enemy.', G, ctx);

	// See second post: https://stackoverflow.com/questions/600743/how-to-get-div-height-to-auto-adjust-to-background-size
	// On why background values are the way they are.
	return (
		<Flex flexDirection="column" height="100vh">
			<Box
				backgroundImage={`url(${background})`}
				backgroundSize="cover"
				backgroundRepeat="no-repeat"
				width="100%"
				height="0"
				paddingTop="60vh"
				position="relative"
			>
				<Flex justifyContent="space-between" top="0" position="absolute" width="100%">
					<Box>
						Hp: {activeAnimal.hp}
						<br />
						Sp: {activeAnimal.sp}
					</Box>
					<Box>
						Hp: {enemyAnimal.hp}
						<br />
						Sp: {enemyAnimal.sp}
					</Box>
				</Flex>
				<Flex
					justifyContent="space-between"
					top="22%"
					position="absolute"
					width="100%"
					height="208px"
				>
					<Box alignSelf="flex-end" paddingRight="35%">
						<AnimalSprite
							src={G.sprites.get(activeAnimal.id)?.url}
							alt="Your cute animal"
						/>
					</Box>
					<Box alignSelf="flex-end">
						<AnimalSprite
							src={G.sprites.get(enemyAnimal.id)?.url}
							alt="Enemy animal"
							transform="scaleX(-1)" // Flip the image.
						/>
					</Box>
				</Flex>
			</Box>
			<MovePanel
				disabled={!isActive}
				onMelee={moves.melee}
				onRange={moves.range}
				onSkill={moves.skill}
				onSwap={moves.swap}
				swapOptions={swapOptions}
			/>
		</Flex>
	);
};

function AnimalSprite({ src, alt, transform }: { src?: string; alt: string; transform?: string }) {
	return (
		<img
			src={src}
			style={{
				display: 'block',
				maxWidth: '100%',
				maxHeight: '100%',
				width: 'auto',
				height: 'auto',
				transform
			}}
			alt={alt}
		/>
	);
}

function MovePanel({
	disabled,
	onMelee,
	onRange,
	onSkill,
	onSwap,
	swapOptions
}: {
	disabled?: boolean;
	onMelee?: () => void;
	onRange?: () => void;
	onSkill?: () => void;
	onSwap?: (animalId: string) => void;
	swapOptions: [Animal, Sprite][];
}) {
	return (
		<Flex
			borderColor="black"
			borderStyle="solid"
			borderRadius="2px"
			borderWidth="7px"
			height="100%"
			padding="6%"
		>
			<Grid
				gridTemplateColumns="1fr"
				gridTemplateRows="repeat(3, 1fr)"
				gridColumnGap="0px"
				gridRowGap="16px"
				flexGrow="1"
			>
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={onMelee}
						disabled={disabled}
					>
						Melee
					</Button>
				</Box>
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={onRange}
						disabled={disabled}
					>
						Range
					</Button>
				</Box>
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={onSkill}
						disabled={disabled}
					>
						Skill
					</Button>
				</Box>
			</Grid>
			<Grid gridTemplateColumns="1fr" gridColumnGap="0px">
				{swapOptions.map(option => (
					<Flex
						key={option[0].id}
						onClick={() => onSwap && onSwap(option[0].id as string)}
					>
						<img
							src={option[1].url}
							alt="Benched animal"
							height="40px"
							width="40px"
							style={{ paddingRight: '8px' }}
						/>
						<Box>
							Hp: {option[0].hp}
							<br />
							Sp: {option[0].sp}
						</Box>
					</Flex>
				))}
			</Grid>
		</Flex>
	);
}
