import {Text, useApp, useInput} from 'ink';
import React, {useState} from 'react';
import {Counter} from './components/Counter.js';
import {clearScreen} from './util/terminal.js';
import { Setup } from './components/Setup.js';
import { CenteredBox } from './components/util/CenteredBox.js';

function App() {
	const app = useApp();

	const [view, setView] = useState('setup');
	const [init, setInit] = useState(0);

	useInput((_, key) => {
		if (key.escape) {
			setView('over');
			setTimeout(() => {
				app.exit();
				clearScreen();
			}, 500);
		}
	});

	if (view === 'setup') {
		return (
			<Setup
				setInit={n => {
					setView('counter');
					return setInit(n);
				}}
			/>
		);
	}
	if (view === 'counter') {
		return <Counter init={init} />;
	}
	if (view === 'over') {
		return <Text>Bye!</Text>;
	}
	return null;
}

clearScreen();

export default function () {
	return (
		<CenteredBox>
			<App />
		</CenteredBox>
	);
}
