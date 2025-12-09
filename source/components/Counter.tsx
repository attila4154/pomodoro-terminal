import {Box, Text} from 'ink';
import React, {useContext, useEffect, useState} from 'react';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';
import {notify} from '../util/terminal.js';
import {TaskInput} from './TaskInput.js';

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
	const [showTaskInput, setShowTaskInput] = useState(false);
	const [task, setTask] = useState<string | null>(null);

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

	useEffect(() => {
		if (showTaskInput) {
			return;
		}
		register({
			key: ' ',
			description: isRunning ? 'pause' : 'start',
			enabled: true,
			action: () => setIsRunning(prev => !prev),
		});
		register({
			key: 'r',
			description: 'reset',
			enabled: !isRunning,
			action: reset,
		});
		register({
			key: 'm',
			description: 'toggle mode',
			enabled: !isRunning,
			action: toggleMode,
		});
		register({
			key: 't',
			description: 'add task',
			enabled: true,
			action: () => setShowTaskInput(true),
		});
		if (task) {
			register({
				key: 'e',
				description: 'remove task',
				enabled: true,
				action: () => setTask(null),
			});
		}

		return () => {
			unregister(' ');
			unregister('r');
			unregister('m');
			unregister('t');
			unregister('e');
		};
	}, [register, setIsRunning, isRunning, isFocus, showTaskInput, task]);

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
			{showTaskInput && (
				<TaskInput
					setTask={task => {
						setTask(task);
						setShowTaskInput(false);
					}}
				/>
			)}
			{!showTaskInput && task && (
				<Box>
					<Text>Working on {task}</Text>
				</Box>
			)}
		</>
	);
}
