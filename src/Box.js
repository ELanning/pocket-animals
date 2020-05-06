import React from 'react';
import styled from 'styled-components';
import {
	color,
	space,
	layout,
	typography,
	flexbox,
	grid,
	background,
	border,
	position,
	shadow,
	compose
} from 'styled-system';

// See https://styled-system.com/api/ for detailed usage.
// eg <Box flex="1 1 auto" borderBottom="1px solid">Hello world</Box>
export const Box = styled('div')(
	compose(typography, space, color, layout, flexbox, grid, background, border, position, shadow)
);

export function Flex({ children, ...rest }) {
	return (
		<Box {...rest} display="flex">
			{children}
		</Box>
	);
}

export function Grid({ children, ...rest }) {
	return (
		<Box {...rest} display="Grid">
			{children}
		</Box>
	);
}
