import {Box, Text} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

const TIMERS = {
	1: [50, 10],
	2: [25, 5],
} as Record<number, [number, number]>;

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

function findTimerInd(timer: [number, number]) {
	const sth = Object.entries(TIMERS).find(
		([_, t]) => t[0] === timer[0] && t[1],
	);
	return Number(sth?.[0]) || 1;
}

export function Setup({
	currentTimer,
	setInit,
}: {
	currentTimer: [number, number];
	setInit: React.Dispatch<React.SetStateAction<[number, number]>>;
}) {
	const {register, unregister} = useContext(KeyPressActionContext);
	const [timers, setTimers] = useState(TIMERS);
	const [currentChoice, setChoice] = useState<number>(
		findTimerInd(currentTimer),
	);

	const minChoice = 1;
	const maxChoice = Object.entries(timers).length;

	useEffect(() => {
		register({
			key: ['downArrow', 'j', ['ctrl', 'n']],
			description: 'next',
			enabled: true,
			order: 1,
			action: () =>
				setChoice(prev => (prev >= minChoice ? maxChoice : prev + 1)),
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
	}, []);

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
		</Box>
	);
}
