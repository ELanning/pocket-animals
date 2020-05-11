import { Animal } from './Animal';
import { assert } from './assert';
import { Entity } from './Entity';

// Handles the model and controller part of the battle.
// https://boardgame.io/documentation/#/
export function createBattleState(setupData: Entity) {
	return {
		name: 'pocket-animals-battle',

		// Using a closure to initialize setup, because
		// boardgame.io framework looks like it only supports setupData directly in lobbies.
		setup: () => {
			return setupData;
		},

		moves: {
			melee(G: Entity, ctx: any) {
				const [attacker, defender] = getInPlayAnimals(G, ctx);
				const damage = Math.floor(
					attacker.level / 4 + attacker.str + attacker.dex / 5 + attacker.luk / 3
				);

				assert(Number.isFinite(damage), 'damage must be a finite number.', damage);
				defender.hp -= damage;

				return G;
			},

			range(G: Entity, ctx: any) {
				const [attacker, defender] = getInPlayAnimals(G, ctx);
				const damage = Math.floor(
					attacker.level / 4 + attacker.str / 5 + attacker.dex + attacker.luk / 3
				);

				assert(Number.isFinite(damage), 'damage must be a finite number.', damage);
				defender.hp -= damage;

				return G;
			},

			skill(G: Entity, ctx: any) {
				return G;
			},

			swap(G: Entity, ctx: any) {
				return G;
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
				next: (G: Entity, ctx: any) => (ctx.playOrderPos + 1) % ctx.numPlayers,

				// This is called at the beginning of the game / phase.
				playOrder: (G: Entity) => {
					// Player with fastest animal goes first.
					return [...G.inBattle]
						.map(id => G.animals.get(id) as Animal)
						.sort((a, b) => a.agi - b.agi)
						.map(animal => animal.userId);
				}
			}
		},

		endIf: () => {
			return;
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

function getInPlayAnimals(G: Entity, ctx: any) {
	const attacker = [...G.inBattle]
		.map(id => G.animals.get(id) as Animal)
		.find(animal => animal.userId === ctx.currentPlayer);
	assert(attacker, 'attacker must exist.', G, ctx);

	const defender = [...G.inBattle]
		.map(id => G.animals.get(id) as Animal)
		.find(animal => animal.userId !== ctx.currentPlayer);
	assert(defender, 'defender must exist.', G, ctx);

	return [attacker, defender];
}
