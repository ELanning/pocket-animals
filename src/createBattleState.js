// Handles the model and controller part of the battle.
// https://boardgame.io/documentation/#/
export function createBattleState(setupData) {
	const battleState = {
		name: 'pocket-animals-battle',

		// Using a closure to initialize setup, because
		// boardgame.io framework looks like it only supports setupData directly in lobbies.
		setup: () => {
			return setupData;
		},

		moves: {
			clickCell(G, ctx, id) {
				return G;
			}
		},

		turn: {
			moveLimit: 1
		},

		endIf: (G, ctx) => {},

		ai: {
			enumerate: G => {
				// TODO, fill out move options.
			}
		}
	};

	return battleState;
}
