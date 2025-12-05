import {Text, useInput} from 'ink';
import React from 'react';

// todo: add custom times
export function Setup({
	setInit,
}: {
	setInit: React.Dispatch<React.SetStateAction<[number, number]>>;
}) {
	useInput(input => {
		if (input === '1') {
			setInit([25 * 60, 5 * 60]);
		} else if (input === '2') {
			setInit([50 * 60, 10 * 60]);
		} else if (input === '3') {
			setInit([10, 10]);
		}
	});
	return (
		<Text>
			Select timer:{'\n'}1. 25/5{'\n'}2. 50/10
		</Text>
	);
}
