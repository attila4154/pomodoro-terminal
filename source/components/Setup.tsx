import {Text} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

const TIMERS = {
	1: [50, 10],
	2: [25, 5],
} as Record<number, [number, number]>;

function Option({
	choice,
	currentChoice,
}: {
	choice: number;
	currentChoice: number;
}) {
	const [min, sec] = TIMERS[choice]!;

	return (
		<Text color={choice === currentChoice ? COLORS.SELECTED : undefined}>
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
	const [choice, setChoice] = useState<number>(findTimerInd(currentTimer));

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
		register({
			key: 'return',
			description: 'select',
			enabled: true,
			order: 3,
			action: () => setInit(timers[choice]!),
		});

		return () => {
			unregister({description: 'next'});
			unregister({description: 'prev'});
			unregister({description: 'select'});
		};
	}, [choice]);

	return (
		<Text>
			Timer:
			{'\n'}
			<Option choice={1} currentChoice={choice} />
			{'\n'}
			<Option choice={2} currentChoice={choice} />
		</Text>
	);
}
