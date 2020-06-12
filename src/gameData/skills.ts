import { Animal, Animation, Game } from '../entities';
import { SkillName } from './tables';
import { animations } from './tables/animations';

// Warning: All skills mutate parameters.
// This is due to speed constraints and simplicity.
export const applySkill = Object.freeze({
	[SkillName.Lightning]: lightning
});

// All skill function signatures must conform to this interface.
interface SkillParameters {
	game: Game;
	attacker: Animal;
	defender: Animal;
}

function lightning({ game, attacker, defender }: SkillParameters) {
	attacker.sp -= 10;
	defender.hp -= 30;
	game.animations.push(
		new Animation(
			'lightning',
			defender.id as string,
			animations.lightning.frameSrcs,
			animations.lightning.durationPerFrameMs
		)
	);
}
