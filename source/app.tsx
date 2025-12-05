import {Text, useApp, useInput} from 'ink';
import React, {useMemo, useState} from 'react';
import {Counter} from './components/Counter.js';
import {Setup} from './components/Setup.js';
import {CenteredBox} from './components/util/CenteredBox.js';
import {clearScreen, OnKeyPressActions} from './util/terminal.js';

function App() {
	const app = useApp();

	const [view, setView] = useState('setup');
	// todo: rename init for more readability
	const [init, setInit] = useState<[number, number]>([0, 0]);

	function quit() {
		clearScreen();
		setView('over');
		setTimeout(() => {
			app.exit();
			clearScreen();
		}, 500);
	}

	useInput((input, key) => {
		if (key.escape) {
			quit();
			return;
		}

		const action = actions[input];
		if (action) {
			action[1]();
		}
	});

	const actions: OnKeyPressActions = useMemo(
		() => ({
			q: ['quit', quit],
		}),
		[],
	);

	if (view === 'setup') {
		return (
			<CenteredBox>
				<Setup
					setInit={n => {
						setView('counter');
						return setInit(n);
					}}
				/>
			</CenteredBox>
		);
	}
	if (view === 'counter') {
		return <Counter init={init} parentActions={actions} />;
	}
	if (view === 'over') {
		return (
			<CenteredBox>
				<Text>Bye!</Text>
			</CenteredBox>
		);
	}
	return null;
}

clearScreen();

// todo: add some dummy header
export default function () {
	return <App />;
}
