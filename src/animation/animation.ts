export function createText(
	text: string,
	selector: string,
	classNames: string[],
	lifetimeMs: number
) {
	const animationDiv = document.createElement('div');
	animationDiv.className = classNames.join(' ');
	const t = document.createTextNode(text);
	animationDiv.append(t);

	const target = document.querySelector(selector);
	if (target) {
		target.before(animationDiv);
		setTimeout(() => {
			animationDiv.remove();
		}, lifetimeMs);
	}
}
