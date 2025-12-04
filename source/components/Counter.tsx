import {Box, Text, useInput} from 'ink';
import React, {useEffect, useState} from 'react';

function getPrintableTime(time: number) {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}

// todo: add footer with keyboard help
export function Counter({init}: {init: number}) {
	const [currentTime, setCurrentTime] = useState(init);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (isRunning) {
			const id = setInterval(() => setCurrentTime(prev => prev - 1), 1000);
			return () => clearInterval(id);
		}

		return () => {};
	}, [isRunning]);

	useInput(input => {
		if (input === ' ') {
			setIsRunning(prev => !prev);
		} else if (input === 'r') {
			setIsRunning(false);
			setCurrentTime(init);
		}
	});

	return (
		<>
			<Box borderStyle="round" paddingRight={2} paddingLeft={2}>
				<Text>🍅 {getPrintableTime(currentTime)}</Text>
			</Box>
			<Box>
				{/* todo: conditionally render start or pause */}
				<Text>Press space to start/pause</Text>
			</Box>
		</>
	);
}
