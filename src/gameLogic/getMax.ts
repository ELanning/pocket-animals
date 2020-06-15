export function getMaxHp(level: number, vit: number) {
	const maxBaseHp = Math.floor(35 + level * 5);

	// +1% total HP per each point of vit.
	const vitBonus = Math.floor(maxBaseHp * vit * 0.01);

	return maxBaseHp + vitBonus;
}

export function getMaxSp(level: number, int: number) {
	const maxBaseSp = Math.floor(10 + level);

	// +1% total SP per each point of int.
	const intBonus = Math.floor(maxBaseSp * int * 0.01);

	return maxBaseSp + intBonus;
}
