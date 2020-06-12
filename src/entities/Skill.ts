export class Skill {
	constructor(
		public animalId: string, // Owner of the skill.
		public name: string // Unique name of the skill. Should be camel case, eg 'lightning', 'fireBlast', etc.
	) {}

	clone = () => {
		return new Skill(this.animalId, this.name);
	};
}
