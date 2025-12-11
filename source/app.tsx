import {Box, Text, useApp, useInput} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {ActionsFooter} from './components/ActionsFooter.js';
import {Counter} from './components/Counter.js';
import {Setup, Timer} from './components/Setup.js';
import {CenteredBox} from './components/util/CenteredBox.js';
import {COLORS} from './config/colors.js';
import {FEATURES} from './config/features.js';
import {
	KeyPressActionContext,
	KeyPressActionProvider,
} from './context/KeyPressActionContext.js';
import {useAllInput} from './hooks/useAllInput.js';
import {clearScreen, runDisableFocusShortcut} from './util/terminal.js';

function App() {
	const app = useApp();
	const {register, unregister, unregisterAll} = useContext(
		KeyPressActionContext,
	);

	const [tab, setTab] = useState(1);
	const [timer, setTimer] = useState<Timer>([50, 10]);
	const [timers, setTimers] = useState<Timer[]>([
		[50, 10],
		[25, 5],
	]);
	const [showFooter, setShowFooter] = useState(true);

	function quit() {
		unregisterAll();
		setTab(9);
		if (FEATURES.FOCUS_MODE_TOGGLE) {
			runDisableFocusShortcut();
		}
		setTimeout(() => {
			app.exit();
			clearScreen();
		}, 500);
	}

	useEffect(() => {
		register({
			key: 'q',
			description: 'quit',
			enabled: true,
			order: 100,
			action: quit,
		});

		register({
			key: 'h',
			description: 'hide help',
			enabled: true,
			order: 1000,
			action: () => setShowFooter(prev => !prev),
		});

		return () => {
			unregister({description: 'quit'});
			unregister({key: 'h'});
		};
	}, []);

	useAllInput();

	return (
		<>
			<Box flexDirection="column">
				<Tabs tab={tab} setTab={setTab} />
				<CenteredBox>
					{tab === 1 && <Counter init={timer} />}
					{tab === 2 && (
						<Setup
							timer={timer}
							timers={timers}
							setTimers={setTimers}
							setTimer={n => {
								setTimer(n);
								setTab(1);
							}}
						/>
					)}
					{tab === 9 && <Text>Bye!</Text>}
				</CenteredBox>
				{showFooter && <ActionsFooter />}
			</Box>
		</>
	);
}

function Tab({
	curTab,
	tabInd,
	setTab,
	children,
}: {
	curTab: number;
	tabInd: number;
	setTab: (t: number) => void;
	children: string;
}) {
	const {isTyping} = useContext(KeyPressActionContext);
	const enabled = curTab === tabInd;

	useInput(
		input => {
			if (input === tabInd.toString()) setTab(tabInd);
		},
		{isActive: !isTyping},
	);

	return (
		<Box>
			<Text color={enabled ? COLORS.SELECTED : undefined}>
				{tabInd}: {children}
			</Text>
		</Box>
	);
}

function Tabs({tab, setTab}: {tab: number; setTab: (n: number) => void}) {
	return (
		<Box
			flexDirection="row"
			justifyContent="flex-start"
			gap={3}
			paddingLeft={2}
			borderStyle={'single'}
			borderTop={false}
			borderLeft={false}
			borderRight={false}
		>
			<Tab tabInd={1} curTab={tab} setTab={setTab}>
				Timer
			</Tab>
			<Tab tabInd={2} curTab={tab} setTab={setTab}>
				Config
			</Tab>
			<Tab tabInd={3} curTab={tab} setTab={setTab}>
				Something
			</Tab>
		</Box>
	);
}

clearScreen();

// todo: add some dummy header
export default function () {
	return (
		<KeyPressActionProvider>
			<App />
		</KeyPressActionProvider>
	);
}
