import {Box, Text} from 'ink';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {FEATURES} from '../config/features.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';
import {
	notify,
	notifySound,
	runDisableFocusShortcut,
	runEnableFocusShortcut,
} from '../util/terminal.js';
import {TaskInput} from './TaskInput.js';

function getPrintableTime(time: number) {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
}

function useFocusMode({
	isRunning,
	isFocus,
}: {
	isRunning: boolean;
	isFocus: boolean;
}) {
	const isFocusModeRef = useRef(false);

	useEffect(() => {
		if (!FEATURES.FOCUS_MODE_TOGGLE) return;

		const shouldBeFocusMode = isRunning && isFocus;

		const timeout = setTimeout(async () => {
			if (shouldBeFocusMode && !isFocusModeRef.current) {
				if (await runEnableFocusShortcut()) {
					isFocusModeRef.current = true;
				}
			} else if (!shouldBeFocusMode && isFocusModeRef.current) {
				if (await runDisableFocusShortcut()) {
					isFocusModeRef.current = false;
				}
			}
		}, 0);

		return () => clearTimeout(timeout);
	}, [isRunning, isFocus]);
}

export function Counter({init}: {init: readonly [number, number]}) {
	init = [init[0] * 60, init[1] * 60];
	const [focusTime, restTime] = init;

	const {register, unregister} = useContext(KeyPressActionContext);

	const [currentTime, setCurrentTime] = useState(focusTime);
	const [isRunning, setIsRunning] = useState(false);
	const [isFocus, setIsFocus] = useState(true);
	const [showTaskInput, setShowTaskInput] = useState(false);
	const [task, setTask] = useState<string | null>(null);

	useFocusMode({isFocus, isRunning});

	useEffect(() => {
		if (isRunning) {
			const id = setInterval(() => {
				if (currentTime === 0) {
					notify(isFocus ? 'Lock-in over!' : 'Time to cook');
					notifySound();
					setIsFocus(prev => {
						setCurrentTime(prev ? restTime : focusTime);
						return !prev;
					});
					setIsRunning(false);
				} else {
					setCurrentTime(prev => prev - 1);
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
			key: [' ', 'return'],
			description: isRunning ? 'pause' : 'start',
			enabled: true,
			order: 1,
			action: () => setIsRunning(prev => !prev),
		});
		register({
			key: 'r',
			description: 'reset',
			enabled: !isRunning,
			order: 2,
			action: reset,
		});
		register({
			key: 'm',
			description: 'toggle mode',
			enabled: !isRunning,
			order: 3,
			action: toggleMode,
		});
		register({
			key: 't',
			description: 'add task',
			enabled: true,
			order: 4,
			action: () => setShowTaskInput(true),
		});
		if (task) {
			register({
				key: 'e',
				description: 'remove task',
				enabled: true,
				order: 5,
				action: () => setTask(null),
			});
		}

		return () => {
			unregister({description: isRunning ? 'pause' : 'start'});
			unregister({key: 'r'});
			unregister({key: 'm'});
			unregister({key: 't'});
			unregister({key: 'e'});
		};
	}, [register, setIsRunning, isRunning, isFocus, showTaskInput, task]);

	let color = undefined;
	if (isFocus) {
		if (isRunning) color = COLORS.FOCUS_RUNNING;
		else color = COLORS.FOCUS_NOT_RUNNING;
	} else {
		if (isRunning) color = COLORS.REST_NOT_RUNNING;
		else color = COLORS.REST_RUNNING;
	}

	return (
		<>
			<Box>
				<Text>{isFocus ? 'Lock-in' : 'Chill'}</Text>
			</Box>
			<Box
				borderStyle="round"
				paddingRight={2}
				paddingLeft={2}
				borderColor={color}
			>
				<Text color={color}>🍅 {getPrintableTime(currentTime)}</Text>
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
