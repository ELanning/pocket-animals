import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Table, User } from './entities';
import * as serviceWorker from './serviceWorker';
import { Routing } from './views';

// Setup example data.
const table = new Table();
const exampleUserId = table.createUser(new User('Erik Lanning')).id as string;
table.createAnimal({
	userId: exampleUserId,
	kind: 'duck',
	level: 1,
	skillPoints: 0,
	statPoints: 0,
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
		<Routing table={table} currentUserId={exampleUserId} />
	</React.StrictMode>,
	document.querySelector('#root')
);

// Service worker documentation: https://bit.ly/CRA-PWA
serviceWorker.register();
