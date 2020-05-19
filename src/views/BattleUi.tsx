// Handles the view of the Pocket Animals game.
// https://boardgame.io/documentation/#/
import './BattleUi.css';

import { Button } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

import background from '../assets/images/background.png';
import { assert } from '../debug/assert';
import { Animal, Sprite, Table } from '../entities';
import { getMaxHp, getMaxSp } from '../game';
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
	const previousDamage = G.previousTurnDamage.find(
		turnDamage => activeAnimal.id === turnDamage.id
	)?.amount;

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
	const previousEnemyDamage = G.previousTurnDamage.find(
		turnDamage => enemyAnimal.id === turnDamage.id
	)?.amount;

	if (ctx.gameover) {
		return <div>Winner: {ctx.gameover.winner}</div>;
	}

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
				<Flex
					top="22%"
					position="absolute"
					height="208px"
					paddingLeft="4px"
					paddingRight="4px"
				>
					<Box alignSelf="flex-end" paddingRight="35%">
						{previousDamage !== undefined && (
							<Box
								textAlign="center"
								fontFamily="m23"
								fontSize="22px"
								className="damage-font"
							>
								{previousDamage || 'Miss'}
							</Box>
						)}
						<AnimalSprite
							src={G.sprites.get(activeAnimal.id)?.url}
							alt="Your cute animal"
							margin="0 0 4px 0"
						/>
						<Box width="86px">
							Hp: {activeAnimal.hp} / {getMaxHp(activeAnimal.level, activeAnimal.vit)}
							<br />
							Sp: {activeAnimal.sp} / {getMaxSp(activeAnimal.level, activeAnimal.int)}
						</Box>
					</Box>
					<Box alignSelf="flex-end">
						{previousEnemyDamage !== undefined && (
							<Box
								textAlign="center"
								fontFamily="m23"
								fontSize="22px"
								className="damage-font"
							>
								{previousEnemyDamage || 'Miss'}
							</Box>
						)}
						<AnimalSprite
							src={G.sprites.get(enemyAnimal.id)?.url}
							alt="Enemy animal"
							transform="scaleX(-1)" // Flip the image.
							margin="0 0 4px 0"
						/>
						<Box width="86px">
							Hp: {enemyAnimal.hp} / {getMaxHp(enemyAnimal.level, enemyAnimal.vit)}
							<br />
							Sp: {enemyAnimal.sp} / {getMaxSp(enemyAnimal.level, enemyAnimal.int)}
						</Box>
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

function AnimalSprite({ src, alt, ...rest }: any) {
	return (
		<img
			src={src}
			alt={alt}
			style={{
				display: 'block',
				maxWidth: '100%',
				maxHeight: '100%',
				width: 'auto',
				height: 'auto',
				...rest
			}}
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
						onClick={() => {
							if (onSwap && option[0].hp > 0) onSwap(option[0].id as string);
						}}
					>
						<img
							src={option[1].url}
							alt="Benched animal"
							height="40px"
							width="40px"
							style={{ paddingRight: '8px' }}
						/>
						<Box>
							Hp: {option[0].hp} / {getMaxHp(option[0].level, option[0].vit)}
							<br />
							Sp: {option[0].sp} / {getMaxSp(option[0].level, option[0].int)}
						</Box>
					</Flex>
				))}
			</Grid>
		</Flex>
	);
}
