import { assert } from './assert';

// Handles the model and controller part of the battle.
// https://boardgame.io/documentation/#/
export function createBattleState(setupData: any) {
	return {
		name: 'pocket-animals-battle',

		// Using a closure to initialize setup, because
		// boardgame.io framework looks like it only supports setupData directly in lobbies.
		setup: () => {
			return setupData;
		},

		moves: {
			melee(G: any, ctx: any) {
				const [attacker, defender] = getInPlayAnimals(G, ctx);
				const damage = Math.floor(
					attacker.level / 4 + attacker.str + attacker.dex / 5 + attacker.luk / 3
				);
				return {
					...G,
					animals: {
						...G.animals,
						[defender.id]: applyDamage({ damage, target: defender })
					}
				};
			},

			range(G: any, ctx: any) {
				const [attacker, defender] = getInPlayAnimals(G, ctx);
				const damage = Math.floor(
					attacker.level / 4 + attacker.str / 5 + attacker.dex + attacker.luk / 3
				);
				return {
					...G,
					animals: {
						...G.animals,
						[defender.id]: applyDamage({ damage, target: defender })
					}
				};
			},

			skill(G: any, ctx: any) {
				return G;
			},

			swap(G: any, ctx: any) {
				return G;
			}
		},

		turn: {
			moveLimit: 1
		},

		endIf: (G: any, ctx: any) => {},

		ai: {
			enumerate: (G: any, ctx: any) => {
				return [
					{ move: 'melee', args: [] },
					{ move: 'range', args: [] },
					{ move: 'skill', args: [] }
				];
			}
		}
	};
}

function applyDamage({ damage, target }: any) {
	assert(Number.isFinite(damage), 'damage must be a finite number.', damage, target);
	return { ...target, hp: target.hp - damage };
}

function getInPlayAnimals(G: any, ctx: any) {
	const attacker = G.animals
		.asArray()
		.find((animal: any) => animal.userId === ctx.currentPlayer && G.inBattle.has(animal.id));
	assert(attacker, 'attacker must exist.', G, ctx);

	const defender = G.animals
		.asArray()
		.find((animal: any) => animal.userId !== ctx.currentPlayer && G.inBattle.has(animal.id));
	assert(defender, 'defender must exist.', G, ctx);

	return [attacker, defender];
}
