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
	timer: Timer;
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
			{choice + 1}. {min}/{sec}
		</Text>
	);
}

export type Timer = [number, number];

export function Setup({
	timers,
	setTimers,
	timer,
	setTimer,
}: {
	timers: Timer[];
	setTimers: Dispatch<SetStateAction<Timer[]>>;
	timer: Timer;
	setTimer: Dispatch<SetStateAction<Timer>>;
}) {
	const {register, unregister} = useContext(KeyPressActionContext);
	const [currentChoice, setChoice] = useState(() =>
		timers.findIndex(t => t[0] === timer[0] && t[1] === timer[1]),
	);

	const minChoice = 0;
	const maxChoice = timers.length;

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
			{timers.map((t, ind) => (
				<Option
					choice={ind}
					selected={currentChoice === ind}
					timer={t}
					onSelect={() => setTimer(timers[ind]!)}
				/>
			))}
			<CustomTimerInput
				choice={maxChoice}
				selected={currentChoice === maxChoice}
				onSubmit={timer => setTimers(prev => [...prev, timer])}
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
	onSubmit: (timer: Timer) => void;
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
				order: 3,
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

			if (input === '/' || isStringNumber(input)) {
				setUserInput(prev => prev + input);
			}
		}
	});

	const prefix = (
		<Text color={selected ? COLORS.SELECTED : undefined}>{choice + 1}. </Text>
	);

	const content = () => {
		if (!selected || !isTyping) {
			return (
				<Text color={selected ? COLORS.SELECTED : undefined}>Custom Timer</Text>
			);
		}
		if (userInput === '') {
			// prettier-ignore
			return <Text color={'gray'}>ff/rr</Text>;
		}

		return <Text>{userInput}|</Text>;
	};

	return (
		<Text>
			{prefix}
			{content()}
		</Text>
	);
}

function getTimerFromInput(input: string) {
	return input.split('/').map(s => +s) as [number, number];
}

function isStringNumber(value: string): boolean {
	// Using Number constructor to attempt conversion
	return !isNaN(Number(value)) && value.trim() !== '';
}
