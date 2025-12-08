import {Box, Text} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {FEATURES} from '../config/setup.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';
import {toggleMusic} from '../util/keyboard.js';
import {notify} from '../util/terminal.js';

function getPrintableTime(time: number) {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}

export function Counter({init}: {init: readonly [number, number]}) {
	init = [init[0] * 60, init[1] * 60];

	const {register, unregister} = useContext(KeyPressActionContext);
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
					reset(!isFocus);
					// 4. session counter or something
					// 5. add to history
				}
			}, 1000);
			return () => clearInterval(id);
		}

		return () => {};
	}, [isRunning, isFocus, currentTime]);

	// todo: add are you sure popup
	function reset(_isFocus = isFocus) {
		setIsRunning(false);
		setCurrentTime(_isFocus ? focusTime : restTime);
	}

	function toggleMode() {
		if (isRunning) return;

		setIsFocus(prev => !prev);
		setCurrentTime(isFocus ? restTime : focusTime);
	}

	function toggleCounter() {
		if (FEATURES.MUSIC_TOGGLE_ENABLED) {
			toggleMusic();
		}

		setIsRunning(prev => !prev);
	}

	useEffect(() => {
		register({
			key: ' ',
			description: isRunning ? 'pause' : 'start',
			enabled: true,
			action: toggleCounter,
		});
		register({
			key: 'r',
			description: 'reset',
			enabled: !isRunning,
			action: reset,
		});
		register({
			key: 't',
			description: 'toggle mode',
			enabled: !isRunning,
			action: toggleMode,
		});

		return () => {
			unregister(' ');
			unregister('r');
			unregister('t');
		};
	}, [register, setIsRunning, isRunning, isFocus]);

	return (
		<>
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
		</>
	);
}
