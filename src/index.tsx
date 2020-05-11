import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Entity } from './Entity';
import { PocketAnimalsApp } from './PocketAnimalsApp';
import * as serviceWorker from './serviceWorker';
import { User } from './User';

// Setup example data.
const entity = new Entity();
const exampleUserId = entity.createUser(new User('Erik Lanning')).id as string;
entity.createAnimal({
	userId: exampleUserId,
	kind: 'duck',
	level: 1,
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
		<PocketAnimalsApp entity={entity} currentUserId={exampleUserId} />
	</React.StrictMode>,
	document.querySelector('#root')
);

// Service worker documentation: https://bit.ly/CRA-PWA
serviceWorker.register();
