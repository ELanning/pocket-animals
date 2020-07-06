import { assert } from '../debug';
import { Animal, Game } from '../entities';
import { applySkill } from './skills';
import { SkillName } from './tables';

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

				applySkill[SkillName.Melee]({ game: state, attacker, defender });

				return state;
			},

			range(G: Game, ctx: any) {
				const state = setupTurnState(G);
				const { attacker, defender } = getInPlayAnimals(state, ctx);

				applySkill[SkillName.Range]({ game: state, attacker, defender });

				return state;
			},

			skill(G: Game, ctx: any, skillName: SkillName) {
				const state = setupTurnState(G);
				const { attacker, defender } = getInPlayAnimals(state, ctx);
				const skill = state.skills.find(
					skill => skill.animalId === attacker.id && skill.name === skillName
				);

				assert(skill, skillName, G, ctx);
				applySkill[skillName]({ game: state, attacker, defender });

				if (defender.hp <= 0) {
					// forceSwap(G, defender.userId);
				}

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
			enumerate: (G: Game, ctx: any, playerID: string) => {
				const options: { move: string; args: any[] }[] = [
					{ move: 'melee', args: [] },
					{ move: 'range', args: [] }
				];

				const usersAnimals = G.getUsersAnimals(playerID);
				const activeAnimal = usersAnimals.find(animal =>
					G.inBattle.has(animal.id as string)
				);
				assert(activeAnimal);

				const availableSkills = G.skills.filter(
					skill => skill.animalId === activeAnimal.id
				);

				for (const skill of availableSkills) {
					options.push({ move: 'skill', args: [skill.name] });
				}

				return options;
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

/*function forceSwap(G: Game, target: Animal) {
	// Swap out in battle animal.
	const nextAvailableAnimal = G.animals[target.userId as string];
	G.inBattle.add(swappedAnimalId);
	G.benched.delete(swappedAnimalId);

	G.inBattle.delete(target.id as string);
	G.benched.add(target.id as string);
}*/
