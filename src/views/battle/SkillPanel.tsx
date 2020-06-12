import { Button } from '@material-ui/core';
import React from 'react';

import { Box, Grid } from '../../ui';
import { BlackFrame } from './BlackFrame';

interface Props {
	onBackClick: () => void;
	children: React.ReactNode;
}

export function SkillPanel({ onBackClick, children }: Props) {
	return (
		<BlackFrame>
			<Box>
				<Grid
					gridTemplateColumns="repeat(2, 1fr)"
					gridTemplateRows="repeat(3, 1fr)"
					gridColumnGap="12px"
					gridRowGap="12px"
					flexGrow="1"
				>
					{children}
				</Grid>
				<Button variant="contained" color="primary" onClick={onBackClick}>
					Back
				</Button>
			</Box>
		</BlackFrame>
	);
}
