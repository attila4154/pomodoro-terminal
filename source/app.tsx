import {Box, Text, useApp, useInput, useStdout} from 'ink';
import notifier from 'node-notifier';
import React, {useEffect, useState} from 'react';

function getPrintableTime(time: number) {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	return `${minutes}:${seconds}`;
}

async function notify() {
	// try {
	// 	exec(
	// 		`osascript -e 'display notification "Done cooking!" with title "Kitchen Terminal"'`,
	// 	);
	// } catch (e) {
	// 	console.log(e);
	// }

	process.stdout.write('\x07'); // ASCII bell
	notifier.notify({
		title: 'My notification',
		message: 'Hello, there!',
		time: 100000,
	});
}

function CenteredBox({children}: {children: React.ReactNode}) {
	const {stdout} = useStdout();

	return (
		<Box
			height={stdout.rows - 2}
			width={stdout.columns - 2}
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
		>
			{children}
		</Box>
	);
}

function Counter({init}: {init: number}) {
	const [currentTime, setCurrentTime] = useState(init);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (isRunning) {
			const id = setInterval(() => setCurrentTime(prev => prev - 1), 1000);
			return () => clearInterval(id);
		}

		return () => {};
	}, [isRunning]);

	useInput(input => {
		if (input === ' ') {
			setIsRunning(prev => !prev);
		} else if (input === 'r') {
			setIsRunning(false);
			setCurrentTime(init);
		}
	});

	return (
		<CenteredBox>
			<Box borderStyle="round" paddingRight={2} paddingLeft={2}>
				<Text>🍅 {getPrintableTime(currentTime)}</Text>
			</Box>
			<Box>
				<Text>Press space to start/pause</Text>
			</Box>
		</CenteredBox>
	);
}

function Setup({
	setInit,
}: {
	setInit: React.Dispatch<React.SetStateAction<number>>;
}) {
	useInput(input => {
		if (input === '1') {
			setInit(25 * 60);
		} else if (input === '2') {
			setInit(50 * 60);
		}
	});
	return (
		<Text>
			Select timer:{'\n'}1. 25/5{'\n'}2. 50/10
		</Text>
	);
}

function App() {
	const app = useApp();

	const [view, setView] = useState('setup');
	const [init, setInit] = useState(0);

	useInput((_, key) => {
		if (key.escape) {
			setView('over');
			setTimeout(() => {
				app.exit();
				process.stdout.write('\x1Bc'); // ANSI clear screen
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

process.stdout.write('\x1Bc'); // ANSI clear screen

export default function () {
	return (
		<Box width={'100%'} height={'100%'}>
			<App />
		</Box>
	);
}
