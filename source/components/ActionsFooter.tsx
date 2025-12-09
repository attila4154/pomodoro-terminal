import {Box, Text, useInput} from 'ink';
import React, {useContext, useState} from 'react';
import {COLORS} from '../config/colors.js';
import {
	isCombination,
	isMyKey,
	KeyPressActionContext,
	MyKey,
	OnKeyPressAction,
} from '../context/KeyPressActionContext.js';

function mapKey(key: MyKey): string {
	if (key === 'ctrl') return 'C';
	if (key === 'downArrow') return '↓';
	if (key === 'upArrow') return '↑';
	if (key === 'return') return '↵';

	return key;
}

function getPrintableKey(action: OnKeyPressAction): string {
	if (isMyKey(action.key)) {
		return mapKey(action.key);
	} else if (typeof action.key === 'string') {
		return action.key;
	} else if (isCombination(action.key)) {
		return `${mapKey(action.key[0])}-${action.key[1]}`;
	}

	return action.key
		.map(key => {
			if (isMyKey(key)) {
				return mapKey(key);
			} else if (typeof key === 'string') {
				return key;
			} else if (isCombination(key)) {
				return `${mapKey(key[0])}-${key[1]}`;
			}
			return '';
		})
		.join('/');
}

function ActionsFooter() {
	let {actions} = useContext(KeyPressActionContext);
	actions = actions.filter(a => a.visible !== false);
	actions = actions.toSorted((a, b) => a.order - b.order);

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
					key={action.description}
					color={
						!action.enabled
							? COLORS.DISABLED
							: pressedKey === action.key
							? COLORS.SELECTED
							: undefined
					}
				>
					[{getPrintableKey(action)}]: {action.description}
				</Text>
			))}
		</Box>
	);
}

export {ActionsFooter};
