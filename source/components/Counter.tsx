import {Box, Text, useInput} from 'ink';
import React, {useEffect, useMemo, useState} from 'react';
import {notify, OnKeyPressActions} from '../util/terminal.js';
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
	init: [number, number];
	parentActions: OnKeyPressActions;
}) {
	const [focusTime, restTime] = init;
	const [currentTime, setCurrentTime] = useState(focusTime);
	const [isRunning, setIsRunning] = useState(false);
	const [isFocus, setIsFocus] = useState(true);

	useEffect(() => {
		if (isRunning) {
			const id = setInterval(() => {
				if (currentTime > 0) {
					setCurrentTime(prev => prev - 1);
				} else {
					// 1. notify
					notify(isFocus ? 'Lock-in over!' : 'Time to cook');
					// 2. print something
					// 3. switch times
					setIsFocus(prev => !prev);
					reset();
					// 4. session counter or something
					// 5. add to history
				}
			}, 1000);
			return () => clearInterval(id);
		}

		return () => {};
	}, [isRunning, isFocus, currentTime]);

	// todo: add are you sure popup
	function reset() {
		setIsRunning(false);
		setCurrentTime(isFocus ? focusTime : restTime);
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
				<Box>
					<Text>{isFocus ? 'Lock-in' : 'Chill'} </Text>
				</Box>
				<Box
					borderStyle="round"
					paddingRight={2}
					paddingLeft={2}
					borderColor={isFocus ? 'red' : 'greenBright'}
				>
					<Text color={isFocus ? 'red' : 'greenBright'}>
						🍅 {getPrintableTime(currentTime)}
					</Text>
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
