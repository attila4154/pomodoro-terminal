import {Text} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

const MIN_CHOICE = 1;
const MAX_CHOICE = 2;

const CHOICE_MAP = {
	1: [25, 5],
	2: [50, 10],
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

export function Setup({
	setInit,
}: {
	setInit: React.Dispatch<React.SetStateAction<readonly [number, number]>>;
}) {
	const {register, unregister} = useContext(KeyPressActionContext);
	const [choice, setChoice] = useState<keyof typeof CHOICE_MAP>(MIN_CHOICE);

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
