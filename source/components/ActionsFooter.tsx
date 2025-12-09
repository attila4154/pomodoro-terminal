import {Box, Text, useInput} from 'ink';
import React, {useContext, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

function ActionsFooter() {
	let {actions} = useContext(KeyPressActionContext);
	actions = actions.filter(a => a.visible !== false);

	const [pressedKey, setPressedKey] = useState<string | null>(null);

	useInput(input => {
		const actionExists = actions.find(a => a.key === input) !== undefined;

		if (actionExists) {
			setPressedKey(input);
			setTimeout(() => setPressedKey(null), 150);
		}
	});

	return (
		<Box height={1} borderTop justifyContent="center" gap={3}>
			{actions.map(action => (
				<Text
					key={action.key}
					color={
						!action.enabled
							? COLORS.DISABLED
							: pressedKey === action.key
							? COLORS.SELECTED
							: undefined
					}
				>
					[{action.key}]: {action.description}
				</Text>
			))}
		</Box>
	);
}

export {ActionsFooter};
