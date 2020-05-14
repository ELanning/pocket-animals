export function getMaxHp({ level, vit }: { level: number; vit: number }) {
	const maxBaseHp = Math.floor(35 + level * 100);

	// +1% per each point of vit.
	const vitBonus = Math.floor((maxBaseHp * vit) / 100);

	return maxBaseHp + vitBonus;
}

export function getMaxSp({ level, int }: { level: number; int: number }) {
	const maxBaseSp = Math.floor(10 + level * 25);

	// +1% per each point of int.
	const intBonus = Math.floor((maxBaseSp * int) / 100);

	return maxBaseSp + intBonus;
}
