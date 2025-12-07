import {Box, Text, useInput} from 'ink';
import React, {useContext, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

function ActionsFooter() {
	const {actions} = useContext(KeyPressActionContext);
	const [pressedKey, setPressedKey] = useState<string | null>(null);

	useInput(input => {
		const actionExists = actions[input] !== undefined;
		if (actionExists) {
			setPressedKey(input);
			setTimeout(() => setPressedKey(null), 150);
		}
	});

	return (
		<Box height={1} borderTop justifyContent="center" gap={3}>
			{Object.entries(actions).map(([key, [description, disabled]]) => (
				<Text
					key={key}
					color={pressedKey === key ? COLORS.SELECTED : undefined}
					dimColor={disabled}
				>
					[{key}]: {description}
				</Text>
			))}
		</Box>
	);
}

export {ActionsFooter};
