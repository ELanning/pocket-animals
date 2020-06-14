import { Animal, Animation, Game } from '../entities';
import { SkillName } from './tables';
import { animations } from './tables/animations';

// Warning: All skills mutate parameters.
// This is due to speed constraints and simplicity.
export const applySkill = Object.freeze({
	[SkillName.Lightning]: lightning,
	[SkillName.Melee]: melee,
	[SkillName.Range]: range
});

// All skill function signatures must conform to this interface.
interface SkillParameters {
	game: Game;
	attacker: Animal;
	defender: Animal;
}

function melee({ game, attacker, defender }: SkillParameters) {
	const damage = getMeleeDamage(attacker);
	const turnDamage = getTurnDamage(attacker, defender, damage);
	game.previousTurnDamage.push({ id: defender.id as string, amount: turnDamage });
	defender.hp -= turnDamage;

	game.animations.push(
		new Animation(
			'melee',
			defender.id as string,
			animations.melee.frameSrcs,
			animations.melee.durationPerFrameMs
		)
	);
}

function range({ game, attacker, defender }: SkillParameters) {
	const damage = getRangeDamage(attacker);
	const turnDamage = getTurnDamage(attacker, defender, damage);
	game.previousTurnDamage.push({ id: defender.id as string, amount: turnDamage });
	defender.hp -= turnDamage;

	game.animations.push(
		new Animation(
			'ranged',
			defender.id as string,
			animations.ranged.frameSrcs,
			animations.ranged.durationPerFrameMs
		)
	);
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
