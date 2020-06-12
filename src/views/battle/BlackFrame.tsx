import React from 'react';

import { Flex } from '../../ui';

export function BlackFrame({ children, ...rest }: { children: React.ReactNode; rest?: any }) {
	return (
		<Flex
			height="100%"
			padding="6%"
			{...rest}
			// These styles are not overridable, use another component if overrides are necessary.
			borderStyle="solid"
			borderRadius="2px"
			borderWidth="7px"
			borderColor="black"
		>
			{children}
		</Flex>
	);
}
