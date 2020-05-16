import { assert, log } from '../debug';
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
				const turnDamage = getTurnDamage(attacker, defender, damage);
				defender.hp -= turnDamage;

				return G;
			},

			range(G: Table, ctx: any) {
				const { attacker, defender } = getInPlayAnimals(G, ctx);

				const damage = getRangeDamage(attacker);
				const turnDamage = getTurnDamage(attacker, defender, damage);
				defender.hp -= turnDamage;

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
	const meleeDamage = Math.floor(animal.level / 4 + animal.str + animal.dex / 3 + animal.luk / 2);
	log('melee damage: ', meleeDamage);
	return meleeDamage;
}

function getRangeDamage(animal: Animal) {
	const rangeDamage = Math.floor(animal.level / 4 + animal.str / 3 + animal.dex + animal.luk / 2);
	log('range damage: ', rangeDamage);
	return rangeDamage;
}

function getDamageReduction(vit: number) {
	const damageReduction = vit / 2 + Math.max(vit * 0.3, Math.pow(vit, 2) / 150);
	log('damage reduction: ', damageReduction);
	return damageReduction;
}

function getCritModifier(attacker: Animal, defender: Animal) {
	const critHitRate = attacker.luk * 0.3;
	const critDefense = defender.luk * 0.2;
	log('crit hit rate: ', critHitRate);
	log('crit defense: ', critDefense);
	return (critHitRate - critDefense) / 100 > Math.random() ? 1.4 : 1;
}

function getTotalDamage(damage: number, damageReduction: number, totalModifier: number) {
	const totalDamage = Math.floor(totalModifier * (damage - damageReduction));
	log('total damage: ', totalDamage);
	return totalDamage;
}

function getAccuracy(animal: Animal) {
	const accuracy = 175 + animal.level + animal.dex + Math.floor(animal.luk * 0.333);
	log('accuracy: ', accuracy);
	return accuracy;
}

function getDodge(animal: Animal) {
	const dodge =
		100 + animal.level + animal.agi + Math.floor(animal.luk * 0.2) + (1 + animal.luk * 0.1);
	log('dodge: ', dodge);
	return dodge;
}

function checkDidHit(accuracy: number, dodge: number) {
	return (accuracy - dodge) / 100 > Math.random();
}
