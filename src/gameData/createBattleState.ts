import { assert } from '../debug';
import { Animal, Game } from '../entities';
import { Animation } from '../entities/Animation';
import { animations } from './tables/animations';

// Handles the model and controller part of the battle.
// https://boardgame.io/documentation/#/
export function createBattleState(setupData: Game) {
	return {
		name: 'pocket-animals-battle',

		// Using a closure to initialize setup, because
		// boardgame.io framework looks like it only supports setupData directly in lobbies.
		setup: () => {
			return setupData;
		},

		moves: {
			melee(G: Game, ctx: any) {
				const state = setupTurnState(G);
				const { attacker, defender } = getInPlayAnimals(state, ctx);

				const damage = getMeleeDamage(attacker);
				const turnDamage = getTurnDamage(attacker, defender, damage);
				state.previousTurnDamage.push({ id: defender.id as string, amount: turnDamage });
				defender.hp -= turnDamage;

				state.animations.push(
					new Animation(
						'melee',
						defender.id as string,
						animations.melee.frameSrcs,
						animations.melee.durationPerFrameMs
					)
				);

				return state;
			},

			range(G: Game, ctx: any) {
				const state = setupTurnState(G);
				const { attacker, defender } = getInPlayAnimals(state, ctx);

				const damage = getRangeDamage(attacker);
				const turnDamage = getTurnDamage(attacker, defender, damage);
				state.previousTurnDamage.push({ id: defender.id as string, amount: turnDamage });
				defender.hp -= turnDamage;

				state.animations.push(
					new Animation(
						'ranged',
						defender.id as string,
						animations.ranged.frameSrcs,
						animations.ranged.durationPerFrameMs
					)
				);

				return state;
			},

			skill(G: Game, ctx: any) {
				const state = setupTurnState(G);
				state.previousTurnDamage = [];
				return state;
			},

			swap(G: Game, ctx: any, swappedAnimalId: string) {
				const state = setupTurnState(G);
				const animals = state.getUsersAnimals(ctx.currentPlayer);

				const swappedAnimal = animals.find(animal => animal.id === swappedAnimalId);
				assert(swappedAnimal, state, ctx, swappedAnimalId);
				assert(swappedAnimal.hp > 0, state, ctx, swappedAnimalId);

				const currentInBattleId = animals.find(animal =>
					state.inBattle.has(animal.id as string)
				)?.id;
				assert(currentInBattleId, state, ctx);

				// Swap out in battle animal.
				state.inBattle.delete(currentInBattleId);
				state.benched.add(currentInBattleId);
				state.inBattle.add(swappedAnimalId);
				state.benched.delete(swappedAnimalId);

				return state;
			}
		},

		turn: {
			moveLimit: 1,
			order: {
				// Get the initial value of playOrderPos.
				// This is called at the beginning of the phase.
				first: () => 0,

				// Get the next value of playOrderPos.
				// This is called at the end of each turn.
				// The phase ends if this returns undefined.
				next: (G: Game, ctx: any) => (ctx.playOrderPos + 1) % ctx.numPlayers,

				// This is called at the beginning of the game / phase.
				playOrder: (G: Game) => {
					// Player with fastest animal goes first.
					return [...G.inBattle]
						.map(id => G.animals.get(id) as Animal)
						.sort((a, b) => a.agi - b.agi)
						.map(animal => animal.userId);
				}
			}
		},

		endIf: (G: Game, ctx: any) => {
			const enemyAnimals = G.getUsersAnimals(ctx.currentPlayer);
			const faintedAnimals = enemyAnimals.filter(animal => animal.hp <= 0);
			const isVictory = enemyAnimals.length === faintedAnimals.length;

			if (isVictory) {
				return { winner: ctx.currentPlayer };
			}
		},

		ai: {
			enumerate: () => {
				return [
					{ move: 'melee', args: [] },
					{ move: 'range', args: [] },
					{ move: 'skill', args: [] }
				];
			}
		}
	};
}

function setupTurnState(G: Game) {
	// Clears old data and avoids mutating previous state.
	const turnState = G.clone();
	turnState.animations = [];
	turnState.previousTurnDamage = [];
	return turnState;
}

function getInPlayAnimals(G: Game, ctx: any) {
	const attacker = [...G.inBattle]
		.map(id => G.animals.get(id) as Animal)
		.find(animal => animal.userId === ctx.currentPlayer);
	assert(attacker, 'attacker must exist.', G, ctx);

	const defender = [...G.inBattle]
		.map(id => G.animals.get(id) as Animal)
		.find(animal => animal.userId !== ctx.currentPlayer);
	assert(defender, 'defender must exist.', G, ctx);

	return { attacker, defender };
}

function getTurnDamage(attacker: Animal, defender: Animal, damage: number) {
	const reduction = getDamageReduction(defender.vit);
	const critDamageModifier = getCritModifier(attacker, defender);
	const totalDamage = getTotalDamage(damage, reduction, critDamageModifier);

	const accuracy = getAccuracy(attacker);
	const dodge = getDodge(defender);
	const didHit = checkDidHit(accuracy, dodge);

	return didHit ? totalDamage : 0;
}

function getMeleeDamage(animal: Animal) {
	return Math.floor(animal.level / 4 + animal.str + animal.dex / 3 + animal.luk / 2);
}

function getRangeDamage(animal: Animal) {
	return Math.floor(animal.level / 4 + animal.str / 3 + animal.dex + animal.luk / 2);
}

function getDamageReduction(vit: number) {
	return vit / 2 + Math.max(vit * 0.3, Math.pow(vit, 2) / 150);
}

function getCritModifier(attacker: Animal, defender: Animal) {
	const critHitRate = attacker.luk * 0.3;
	const critDefense = defender.luk * 0.2;
	return (critHitRate - critDefense) / 100 > Math.random() ? 1.4 : 1;
}

function getTotalDamage(damage: number, damageReduction: number, totalModifier: number) {
	return Math.floor(totalModifier * (damage - damageReduction));
}

function getAccuracy(animal: Animal) {
	return 175 + animal.level + animal.dex + Math.floor(animal.luk * 0.333);
}

function getDodge(animal: Animal) {
	return 100 + animal.level + animal.agi + Math.floor(animal.luk * 0.2) + (1 + animal.luk * 0.1);
}

function checkDidHit(accuracy: number, dodge: number) {
	return (accuracy - dodge) / 100 > Math.random();
}
