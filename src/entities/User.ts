export class User {
	constructor(
		public name: string,
		public profileUrl?: string,
		public id?: string // Use undefined for unsaved users.
	) {}

	clone = () => {
		return new User(this.name, this.profileUrl, this.id);
	};
}
