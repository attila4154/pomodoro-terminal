import {Box, Text, useInput} from 'ink';
import React, {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import {COLORS} from '../config/colors.js';
import {
	KeyPressActionContext,
	useIsTyping,
} from '../context/KeyPressActionContext.js';

function Option({
	choice,
	selected,
	timer,
	onSelect,
}: {
	choice: number;
	selected: boolean;
	timer: [number, number];
	onSelect: () => void;
}) {
	const {register, unregister} = useContext(KeyPressActionContext);
	const [min, sec] = timer;

	useEffect(() => {
		if (selected) {
			register({
				key: 'return',
				description: 'select',
				enabled: true,
				order: 3,
				action: onSelect,
			});
		}

		return selected ? () => unregister({description: 'select'}) : () => {};
	}, [selected]);

	return (
		<Text color={selected ? COLORS.SELECTED : undefined}>
			{choice}. {min}/{sec}
		</Text>
	);
}

function findTimerInd(timer: [number, number], timers: Timers) {
	const sth = Object.entries(timers).find(
		([_, t]) => t[0] === timer[0] && t[1],
	);
	return Number(sth?.[0]) || 1;
}

export type Timers = Record<number, [number, number]>;

export function Setup({
	timers,
	setTimers,
	currentTimer,
	setInit,
}: {
	timers: Timers;
	setTimers: Dispatch<SetStateAction<Timers>>;
	currentTimer: [number, number];
	setInit: Dispatch<SetStateAction<[number, number]>>;
}) {
	const {register, unregister} = useContext(KeyPressActionContext);
	const [currentChoice, setChoice] = useState<number>(
		findTimerInd(currentTimer, timers),
	);

	const minChoice = 1;
	const maxChoice = Object.entries(timers).length + 1;

	useEffect(() => {
		register({
			key: ['downArrow', 'j', ['ctrl', 'n']],
			description: 'next',
			enabled: true,
			order: 1,
			action: () =>
				setChoice(prev => (prev >= maxChoice ? minChoice : prev + 1)),
		});
		register({
			key: ['upArrow', 'k', ['ctrl', 'p']],
			description: 'prev',
			enabled: true,
			order: 2,
			action: () =>
				setChoice(prev => (prev <= minChoice ? maxChoice : prev - 1)),
		});

		return () => {
			unregister({description: 'next'});
			unregister({description: 'prev'});
		};
	}, [maxChoice]);

	return (
		<Box flexDirection="column">
			<Text>Timer:</Text>
			{Object.entries(timers).map(([ind, timer]) => (
				<Option
					choice={+ind}
					selected={currentChoice === +ind}
					timer={timer}
					onSelect={() => setInit(timers[+ind]!)}
				/>
			))}
			<CustomTimerInput
				choice={maxChoice}
				selected={currentChoice === maxChoice}
				onSubmit={timer => setTimers(prev => ({...prev, [maxChoice]: timer}))}
			/>
		</Box>
	);
}

function CustomTimerInput({
	choice,
	onSubmit,
	selected,
}: {
	choice: number;
	onSubmit: (timer: [number, number]) => void;
	selected: boolean;
}) {
	const {register, unregister} = useContext(KeyPressActionContext);
	const [isTyping, setIsTyping] = useState(false);
	const [userInput, setUserInput] = useState('');

	useIsTyping(isTyping);

	useEffect(() => {
		if (selected) {
			register({
				key: 'return',
				description: 'enter',
				enabled: true,
				order: 100,
				action: () => setIsTyping(true),
			});
		}

		return selected ? () => unregister({key: 'return'}) : () => {};
	}, [selected]);

	useInput((input, key) => {
		if (isTyping) {
			if (key.escape) {
				setIsTyping(false);
				return;
			}

			if (key.delete) {
				setUserInput(prev => prev.slice(0, -1));
				return;
			}

			if (userInput !== '' && key.return) {
				onSubmit(getTimerFromInput(userInput));
				setIsTyping(false);
				setUserInput('');
			}

			if (input) {
				setUserInput(prev => prev + input);
			}
		}
	});

	if (!selected) {
		return <Text>{choice}. Custom Timer</Text>;
	}

	if (!isTyping) {
		return <Text color={'gray'}>mm/mm</Text>;
	}

	return <Text>{userInput}|</Text>;
}

function getTimerFromInput(input: string) {
	return input.split('/').map(s => +s) as [number, number];
}
