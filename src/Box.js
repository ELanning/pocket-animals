import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {
	background,
	border,
	color,
	compose,
	flexbox,
	grid,
	layout,
	position,
	shadow,
	space,
	typography
} from 'styled-system';

// See https://styled-system.com/api/ for detailed usage.
// eg <Box flex="1 1 auto" borderBottom="1px solid">Hello world</Box>
export const Box = styled('div')(
	compose(typography, space, color, layout, flexbox, grid, background, border, position, shadow)
);

Flex.propTypes = {
	children: PropTypes.node
};
export function Flex({ children, ...rest }) {
	return (
		<Box {...rest} display="flex">
			{children}
		</Box>
	);
}

Grid.propTypes = {
	children: PropTypes.node
};
export function Grid({ children, ...rest }) {
	return (
		<Box {...rest} display="Grid">
			{children}
		</Box>
	);
}
