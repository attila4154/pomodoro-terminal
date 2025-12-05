import {Box, Text, useInput} from 'ink';
import React, {useContext, useState} from 'react';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

function ActionsFooter() {
	const {actions} = useContext(KeyPressActionContext);
	const [pressedKey, setPressedKey] = useState<string | null>(null);

	useInput(input => {
		const actionExists = actions[input] !== undefined;
		if (actionExists) {
			setPressedKey(input);
			setTimeout(() => setPressedKey(null), 300);
		}
	});

	return (
		<Box height={1} borderTop justifyContent="center" gap={3}>
			{Object.entries(actions).map(([key, [description]]) => (
				<Text
					key={key}
					dimColor={pressedKey === key}
					color={pressedKey === key ? 'blue' : undefined}
				>
					[{key}]: {description}
				</Text>
			))}
		</Box>
	);
}

export {ActionsFooter};
