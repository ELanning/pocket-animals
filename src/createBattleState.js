// Handles the model and controller part of the battle.
// https://boardgame.io/documentation/#/
export function createBattleState(setupData) {
	return {
		name: 'pocket-animals-battle',

		// Using a closure to initialize setup, because
		// boardgame.io framework looks like it only supports setupData directly in lobbies.
		setup: () => {
			return setupData;
		},

		moves: {
			clickCell(G, context, id) {
				return G;
			}
		},

		turn: {
			moveLimit: 1
		},

		endIf: (G, context) => {},

		ai: {
			enumerate: G => {
				// TODO, fill out move options.
			}
		}
	};
}
