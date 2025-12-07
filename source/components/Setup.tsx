import {Text, useInput} from 'ink';
import React, {useState} from 'react';

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
		<Text bold={choice === currentChoice}>
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

	useInput((_, key) => {
		if (key.downArrow) {
			setChoice(prev => (prev >= MAX_CHOICE ? MIN_CHOICE : prev + 1) as Choice);
		}

		if (key.upArrow) {
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
