import { assert } from '../debug/assert';
import { Animal, Table } from '../entities';

// Handles the model and controller part of the battle.
// https://boardgame.io/documentation/#/
export function createBattleState(setupData: Table) {
	return {
		name: 'pocket-animals-battle',

		// Using a closure to initialize setup, because
		// boardgame.io framework looks like it only supports setupData directly in lobbies.
		setup: () => {
			return setupData;
		},

		moves: {
			melee(G: Table, ctx: any) {
				const { attacker, defender } = getInPlayAnimals(G, ctx);
				const damage = getMeleeDamage(attacker);
				const reduction = getDamageReduction(defender.vit);
				const totalDamage = getTotalDamage(damage, reduction);

				defender.hp -= totalDamage;

				return G;
			},

			range(G: Table, ctx: any) {
				const { attacker, defender } = getInPlayAnimals(G, ctx);
				const damage = getRangeDamage(attacker);
				const reduction = getDamageReduction(defender.vit);
				const totalDamage = getTotalDamage(damage, reduction);

				defender.hp -= totalDamage;

				return G;
			},

			skill(G: Table, ctx: any) {
				return G;
			},

			swap(G: Table, ctx: any) {
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
				next: (G: Table, ctx: any) => (ctx.playOrderPos + 1) % ctx.numPlayers,

				// This is called at the beginning of the game / phase.
				playOrder: (G: Table) => {
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

function getInPlayAnimals(G: Table, ctx: any) {
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

function getMeleeDamage(animal: Animal) {
	const damage = Math.floor(animal.level / 4 + animal.str + animal.dex / 5 + animal.luk / 3);
	assert(Number.isFinite(damage), 'damage must be a finite number.', damage);
	return damage;
}

function getRangeDamage(animal: Animal) {
	const damage = Math.floor(animal.level / 4 + animal.str / 5 + animal.dex + animal.luk / 3);
	assert(Number.isFinite(damage), 'damage must be a finite number.', damage);
	return damage;
}

function getDamageReduction(vit: number) {
	const damageReduction = vit / 2 + Math.max(vit * 0.3, Math.pow(vit, 2) / 150);
	assert(
		Number.isFinite(damageReduction),
		'damageReduction must be a finite number',
		damageReduction
	);
	return damageReduction;
}

function getTotalDamage(damage: number, damageReduction: number) {
	return Math.floor(damage - damageReduction);
}
