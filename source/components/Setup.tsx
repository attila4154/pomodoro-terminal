import {Text, useInput} from 'ink';
import React from 'react';

// todo: add custom times
export function Setup({
	setInit,
}: {
	setInit: React.Dispatch<React.SetStateAction<number>>;
}) {
  // todo: return both focus/rest times instead
	useInput(input => {
		if (input === '1') {
			setInit(25 * 60);
		} else if (input === '2') {
			setInit(50 * 60);
		}
	});
	return (
		<Text>
			Select timer:{'\n'}1. 25/5{'\n'}2. 50/10
		</Text>
	);
}
