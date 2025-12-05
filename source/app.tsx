import {Text, useApp} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {ActionsFooter} from './components/ActionsFooter.js';
import {Counter} from './components/Counter.js';
import {Setup} from './components/Setup.js';
import {CenteredBox} from './components/util/CenteredBox.js';
import {
	KeyPressActionContext,
	KeyPressActionProvider,
} from './context/KeyPressActionContext.js';
import {useAllInput} from './hooks/useAllInput.js';
import {clearScreen} from './util/terminal.js';

function App() {
	const app = useApp();
	const {register, unregister} = useContext(KeyPressActionContext);

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

	useEffect(() => {
		register('q', 'quit', quit);

		return () => {
			unregister('q');
		};
	}, [register]);

	useAllInput();

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

// todo: add some dummy header
export default function () {
	return (
		<KeyPressActionProvider>
			<CenteredBox>
				<App />
			</CenteredBox>
			<ActionsFooter />
		</KeyPressActionProvider>
	);
}
