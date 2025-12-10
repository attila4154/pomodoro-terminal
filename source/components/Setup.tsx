import {Text} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

const MIN_CHOICE = 1;
const MAX_CHOICE = 2;

const CHOICE_MAP = {
	1: [50, 10],
	2: [25, 5],
} as const;

type Choice = keyof typeof CHOICE_MAP;

function Option({
	choice,
	currentChoice,
}: {
	choice: Choice;
	currentChoice: Choice;
}) {
	const [min, sec] = CHOICE_MAP[choice];

	return (
		<Text color={choice === currentChoice ? COLORS.SELECTED : undefined}>
			{choice}. {min}/{sec}
		</Text>
	);
}

function findTimerInd(timer: readonly [number, number]) {
	const sth = Object.entries(CHOICE_MAP).find(
		([_, t]) => t[0] === timer[0] && t[1],
	);
	return (Number(sth?.[0]) || MIN_CHOICE) as Choice;
}

export function Setup({
	currentTimer,
	setInit,
}: {
	currentTimer: readonly [number, number];
	setInit: React.Dispatch<React.SetStateAction<readonly [number, number]>>;
}) {
	const {register, unregister} = useContext(KeyPressActionContext);
	const [choice, setChoice] = useState<keyof typeof CHOICE_MAP>(
		findTimerInd(currentTimer),
	);

	useEffect(() => {
		register({
			key: ['downArrow', 'j', ['ctrl', 'n']],
			description: 'next',
			enabled: true,
			order: 1,
			action: () =>
				setChoice(
					prev => (prev >= MAX_CHOICE ? MIN_CHOICE : prev + 1) as Choice,
				),
		});
		register({
			key: ['upArrow', 'k', ['ctrl', 'p']],
			description: 'prev',
			enabled: true,
			order: 2,
			action: () =>
				setChoice(
					prev => (prev <= MIN_CHOICE ? MAX_CHOICE : prev - 1) as Choice,
				),
		});
		register({
			key: 'return',
			description: 'select',
			enabled: true,
			order: 3,
			action: () => {
				return setInit(CHOICE_MAP[choice]);
			},
		});

		return () => {
			unregister({description: 'next'});
			unregister({description: 'prev'});
			unregister({description: 'select'});
		};
	}, [choice]);

	return (
		<Text>
			Select timer:
			{'\n'}
			<Option choice={1} currentChoice={choice} />
			{'\n'}
			<Option choice={2} currentChoice={choice} />
		</Text>
	);
}
