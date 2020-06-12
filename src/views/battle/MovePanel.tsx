import { Button } from '@material-ui/core';
import React from 'react';

import { Box, Grid } from '../../ui';
import { BlackFrame } from './BlackFrame';

export function MovePanel({
	disabled,
	onMelee,
	onRange,
	onSkill,
	children
}: {
	disabled?: boolean;
	onMelee?: () => void;
	onRange?: () => void;
	onSkill?: () => void;
	children: React.ReactNode;
}) {
	return (
		<BlackFrame>
			<Grid
				gridTemplateColumns="1fr"
				gridTemplateRows="repeat(3, 1fr)"
				gridColumnGap="0px"
				gridRowGap="16px"
				flexGrow="1"
			>
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={onMelee}
						disabled={disabled}
					>
						Melee
					</Button>
				</Box>
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={onRange}
						disabled={disabled}
					>
						Range
					</Button>
				</Box>
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={onSkill}
						disabled={disabled}
					>
						Skill
					</Button>
				</Box>
			</Grid>
			{children}
		</BlackFrame>
	);
}
