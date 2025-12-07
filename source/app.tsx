import {Box, Text, useApp, useInput} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {ActionsFooter} from './components/ActionsFooter.js';
import {Counter} from './components/Counter.js';
import {Setup} from './components/Setup.js';
import {CenteredBox} from './components/util/CenteredBox.js';
import {COLORS} from './config/colors.js';
import {
	KeyPressActionContext,
	KeyPressActionProvider,
} from './context/KeyPressActionContext.js';
import {useAllInput} from './hooks/useAllInput.js';
import {clearScreen} from './util/terminal.js';

function App() {
	const app = useApp();
	const {register, unregister, unregisterAll} = useContext(
		KeyPressActionContext,
	);

	const [tab, setTab] = useState(1);
	const [init, setInit] = useState<readonly [number, number]>([50, 10]);

	function quit() {
		unregisterAll();
		setTab(9);
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

	return (
		<>
			<Box flexDirection="column">
				<Tabs tab={tab} setTab={setTab} />
				<CenteredBox>
					{tab === 1 && <Counter init={init} />}
					{tab === 2 && (
						<Setup
							setInit={n => {
								setInit(n);
								setTab(1);
							}}
						/>
					)}
					{tab === 9 && <Text>Bye!</Text>}
				</CenteredBox>
				<ActionsFooter />
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
	const enabled = curTab === tabInd;

	useInput(input => {
		if (input === tabInd.toString()) setTab(tabInd);
	});

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
