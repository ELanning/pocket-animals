import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import styledTs from 'styled-components-ts';
import {
	background,
	BackgroundProps,
	border,
	BorderProps,
	color,
	ColorProps,
	compose,
	flexbox,
	FlexboxProps,
	grid,
	GridProps,
	layout,
	LayoutProps,
	position,
	PositionProps,
	shadow,
	ShadowProps,
	space,
	SpaceProps,
	typography,
	TypographyProps
} from 'styled-system';

type BoxProps = BackgroundProps &
	BorderProps &
	ColorProps &
	FlexboxProps &
	GridProps &
	LayoutProps &
	PositionProps &
	ShadowProps &
	SpaceProps &
	TypographyProps;

// See https://styled-system.com/api/ for detailed usage.
// eg <Box flex="1 1 auto" borderBottom="1px solid">Hello world</Box>
export const Box = styledTs<BoxProps>(styled.div)(
	compose(typography, space, color, layout, flexbox, grid, background, border, position, shadow)
);

export const Flex: FunctionComponent<any> = ({ children, ...rest }: any) => {
	return (
		<Box {...rest} display="flex">
			{children}
		</Box>
	);
};

export function Grid({ children, ...rest }: any) {
	return (
		<Box {...rest} display="Grid">
			{children}
		</Box>
	);
}
