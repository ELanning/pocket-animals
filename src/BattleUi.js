// Handles the view of the Pocket Animals game.
// https://boardgame.io/documentation/#/
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Box, Flex, Grid } from './Box';

BattleUi.propTypes = {
	G: PropTypes.any.isRequired,
	ctx: PropTypes.any.isRequired,
	moves: PropTypes.any.isRequired,
	playerID: PropTypes.string, // ID comes from boardgame.io framework. Prefer "id" over "ID" in all other contexts.
	isActive: PropTypes.bool,
	isMultiplayer: PropTypes.bool,
	isConnected: PropTypes.bool,
	isPreview: PropTypes.bool
};

export function BattleUi({
	G,
	ctx,
	moves,
	playerID,
	isActive,
	isMultiplayer,
	isConnected,
	isPreview
}) {
	return (
		<Box>
			<Box>
				<Box>Hp / Sp</Box>
				<Box>Your Guy</Box>
			</Box>
			<Box>
				<Box>Hp / Sp</Box>
				<Box>Enemy Guy</Box>
			</Box>
			<Grid>
				<Box>
					<Button>Melee</Button>
				</Box>
				<Box>
					<Button>Ranged</Button>
				</Box>
				<Box>
					<Button>Special</Button>
				</Box>
				<Box>
					<Button>Swap</Button>
				</Box>
			</Grid>
		</Box>
	);
}
