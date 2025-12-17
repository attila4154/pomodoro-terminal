import {Box, Text, useInput} from 'ink';
import React, {useState} from 'react';
import {COLORS} from '../config/colors.js';
import {useIsTyping} from '../context/KeyPressActionContext.js';

export function TaskInput({setTask}: {setTask: (task: string | null) => void}) {
	const [taskInput, setTaskInput] = useState('');

	useIsTyping(true);

	useInput((input, key) => {
		if (key.return) {
			setTask(taskInput);
			return;
		}
		if (key.escape) {
			setTask(null);
			return;
		}
		if (key.delete) {
			setTaskInput(prev => prev.slice(0, -1));
			return;
		}
		setTaskInput(prev => prev + input);
	});

	return (
		<Box>
			<Text color={taskInput ? undefined : COLORS.DISABLED}>
				{taskInput ? taskInput + '_' : '> Enter your task...'}
			</Text>
		</Box>
	);
}
