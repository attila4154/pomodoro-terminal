import {Text, useInput} from 'ink';
import React, {useState} from 'react';
import {COLORS} from '../config/colors.js';

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
			{min}/{sec}
		</Text>
	);
}

// todo: add custom times
export function Setup({
	setInit,
}: {
	setInit: React.Dispatch<React.SetStateAction<readonly [number, number]>>;
}) {
	const [choice, setChoice] = useState<keyof typeof CHOICE_MAP>(MIN_CHOICE);

	// todo: move to all actions?
	useInput((input, key) => {
		if (key.downArrow || input === 'j' || (input === 'n' && key.ctrl)) {
			setChoice(prev => (prev >= MAX_CHOICE ? MIN_CHOICE : prev + 1) as Choice);
		}

		if (key.upArrow || input === 'k' || (input === 'p' && key.ctrl)) {
			setChoice(prev => (prev <= MIN_CHOICE ? MAX_CHOICE : prev - 1) as Choice);
		}

		if (key.return) {
			setInit(CHOICE_MAP[choice]);
		}
	});
	return (
		<Text>
			Select timer:
			{'\n'}1. <Option choice={1} currentChoice={choice} />
			{'\n'}2. <Option choice={2} currentChoice={choice} />
		</Text>
	);
}
