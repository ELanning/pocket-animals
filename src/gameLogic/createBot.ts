import { Ctx, Game, PlayerID } from 'boardgame.io';
import { MCTSBot } from 'boardgame.io/ai';

interface Objective {
	checker: (G: any, ctx: Ctx) => boolean;
	weight: number;
}

type Objectives = Record<string, Objective>;

export function createBot(args: {
	enumerate: any;
	seed?: string | number;
	game: Game;
	objectives?: (G: any, ctx: Ctx, playerID?: PlayerID) => Objectives;
	iterations?: number | ((G: any, ctx: Ctx, playerID?: PlayerID) => number);
	playoutDepth?: number | ((G: any, ctx: Ctx, playerID?: PlayerID) => number);
	iterationCallback?: (data: {
		iterationCounter: number;
		numIterations: number;
		metadata: Node;
	}) => void;
}) {
	// Small wrapper around MCTSBot.
	// Sets async to true so that the AI computation does not freeze the UI.
	const bot = new MCTSBot(args);
	bot.setOpt('async', true);
	return bot;
}
