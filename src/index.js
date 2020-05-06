import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Entities, createUser, createAnimal } from './Entities';
import { PocketAnimalsApp } from './PocketAnimalsApp';
import * as serviceWorker from './serviceWorker';

// Setup example data.
const exampleUserId = createUser({ name: 'Erik' }).id;
createAnimal({
	userId: exampleUserId,
	hp: 100,
	sp: 50,
	str: 3,
	agi: 30,
	vit: 10,
	int: 5,
	dex: 3,
	luk: 5
});

ReactDOM.render(
	<React.StrictMode>
		<PocketAnimalsApp entities={Entities} currentUserId={exampleUserId} />
	</React.StrictMode>,
	document.getElementById('root')
);

// Service worker documentation: https://bit.ly/CRA-PWA
serviceWorker.register();
