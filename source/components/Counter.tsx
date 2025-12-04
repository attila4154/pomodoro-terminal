import {Box, Text, useInput} from 'ink';
import React, {useEffect, useMemo, useState} from 'react';
import {OnKeyPressActions} from '../util/terminal.js';
import {CenteredBox} from './util/CenteredBox.js';

function getPrintableTime(time: number) {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}

export function Counter({
	init,
	parentActions,
}: {
	init: number;
	parentActions: OnKeyPressActions;
}) {
	const [currentTime, setCurrentTime] = useState(init);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (isRunning) {
			const id = setInterval(() => setCurrentTime(prev => prev - 1), 1000);
			return () => clearInterval(id);
		}

		return () => {};
	}, [isRunning]);

	function reset() {
		setIsRunning(false);
		setCurrentTime(init);
	}

	const actions: OnKeyPressActions = useMemo(
		() => ({
			' ': ['start/pause', () => setIsRunning(prev => !prev)],
			r: ['reset', reset],
		}),
		[],
	);
	const allActions = {...parentActions, ...actions};

	useInput(input => {
		const action = actions[input];
		if (action) {
			action[1]();
		}
	});

	return (
		<>
			<CenteredBox>
				<Box borderStyle="round" paddingRight={2} paddingLeft={2}>
					<Text>🍅 {getPrintableTime(currentTime)}</Text>
				</Box>
			</CenteredBox>
			{/* todo: there is probably a better way to do it, most likely in parent too */}
			<Box height={1} borderTop justifyContent="center" gap={3}>
				{Object.entries(allActions).map(([key, [description]]) => (
					<Text key={key}>
						[{key}]: {description}
					</Text>
				))}
			</Box>
		</>
	);
}
