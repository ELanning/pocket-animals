// Handles the view of the Pocket Animals game.
// https://boardgame.io/documentation/#/
import './BattleUi.css';
import './animations.css';

import { Button } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { createAnimation, createText } from '../../animation';
import background from '../../assets/images/background.png';
import { assert } from '../../debug/assert';
import { Animal, Animation, Game, Sprite } from '../../entities';
import { getMaxHp, getMaxSp } from '../../gameLogic';
import { Box, Flex, Grid } from '../../ui/Box';
import { MovePanel } from './MovePanel';
import { SkillPanel } from './SkillPanel';

interface Moves {
	melee: () => void;
	range: () => void;
	skill: (skillName: string) => void;
	swap: (animalId: string) => void;
}

interface Props {
	G: Game;
	ctx: any;
	moves: Moves;
	playerID: string; // ID comes from boardgame.io framework. Prefer "id" over "ID" in all other contexts.
	isActive: boolean;
}

enum View {
	MovePanel,
	SkillPanel
}

export const BattleUi: FunctionComponent<Props> = ({
	G,
	ctx,
	moves,
	playerID,
	isActive
}: Props) => {
	const [view, setView] = useState(View.MovePanel);

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

	const availableSkills = G.skills.filter(skill => skill.animalId === activeAnimal.id);

	useEffect(() => {
		async function playAnimations() {
			assert(activeAnimal);
			assert(enemyAnimal);

			for (const animation of G.animations) {
				await playAnimation(animation, activeAnimal, enemyAnimal);
			}

			displayDamage(G, activeAnimal, '.player-animal');
			displayDamage(G, enemyAnimal, '.enemy-animal');
		}

		playAnimations();
	}, [G, ctx, enemyAnimal, activeAnimal]);

	if (ctx.gameover) {
		return <div>Winner: {ctx.gameover.winner}</div>;
	}

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
					top="19vh"
					position="absolute"
					height="208px"
					paddingLeft="4px"
					paddingRight="4px"
				>
					<Box alignSelf="flex-end" paddingRight="35%" position="relative">
						<AnimalSprite
							src={G.sprites.get(activeAnimal.id)?.src}
							alt="Your cute animal"
							margin="0 0 4px 0"
							className="player-animal"
						/>
						<Box width="86px">
							Hp: {activeAnimal.hp} / {getMaxHp(activeAnimal.level, activeAnimal.vit)}
							<br />
							Sp: {activeAnimal.sp} / {getMaxSp(activeAnimal.level, activeAnimal.int)}
						</Box>
					</Box>
					<Box alignSelf="flex-end" position="relative">
						<AnimalSprite
							src={G.sprites.get(enemyAnimal.id)?.src}
							alt="Enemy animal"
							transform="scaleX(-1)" // Flip the image.
							margin="0 0 4px 0"
							className="enemy-animal"
						/>
						<Box width="86px">
							Hp: {enemyAnimal.hp} / {getMaxHp(enemyAnimal.level, enemyAnimal.vit)}
							<br />
							Sp: {enemyAnimal.sp} / {getMaxSp(enemyAnimal.level, enemyAnimal.int)}
						</Box>
					</Box>
				</Flex>
			</Box>
			{view === View.MovePanel ? (
				<MovePanel
					disabled={!isActive}
					onMelee={moves.melee}
					onRange={moves.range}
					onSkill={() => {
						setView(View.SkillPanel);
					}}
				>
					<Grid gridTemplateColumns="1fr" gridColumnGap="0px">
						{swapOptions.map(option => (
							<Flex
								key={option[0].id}
								onClick={() => {
									if (option[0].hp > 0) {
										moves.swap(option[0].id as string);
									}
								}}
							>
								<img
									src={option[1].src}
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
				</MovePanel>
			) : (
				<SkillPanel onBackClick={() => setView(View.MovePanel)}>
					{availableSkills.map(skill => (
						<Box key={skill.name}>
							<Button
								variant="contained"
								color="primary"
								onClick={() => moves.skill(skill.name)}
							>
								{skill.name}
							</Button>
						</Box>
					))}
				</SkillPanel>
			)}
		</Flex>
	);
};

function AnimalSprite({ src, alt, className, ...rest }: any) {
	return (
		<img
			src={src}
			alt={alt}
			className={className}
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

async function playAnimation(animation: Animation, activeAnimal: Animal, enemyAnimal: Animal) {
	let className: string | undefined;
	let targetSelector: string | undefined;
	let direction: string | undefined;

	if (animation.targetId === enemyAnimal.id) {
		direction = 'right';
		className = `battle-animation-${direction}`;
		targetSelector = '.enemy-animal';
	} else if (animation.targetId === activeAnimal.id) {
		direction = 'left';
		className = `battle-animation-${direction}`;
		targetSelector = '.player-animal';
	}

	assert(className, 'missing className', className, animation);
	assert(targetSelector, 'missing target', animation);
	assert(direction, 'missing direction', animation);

	await createAnimation(
		animation.frameSrcs,
		targetSelector,
		[className, `${animation.name}-${direction}`],
		animation.frameDurationMs
	);
}

function displayDamage(G: Game, target: Animal, selector: string) {
	const durationMs = 3000;

	// Display taken damage.
	const previousDamage = G.previousTurnDamage.find(turnDamage => target.id === turnDamage.id)
		?.amount;
	if (previousDamage !== undefined) {
		// TODO: Differentiate between miss and 0 damage taken due to reduction?
		const damageText = previousDamage === 0 ? 'Miss' : previousDamage.toString();
		createText(damageText, selector, ['damage-font'], durationMs);
	}
}
