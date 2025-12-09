import {Key, useInput} from 'ink';
import {useContext} from 'react';
import {
	isCombination,
	isMyKey,
	KeyPressActionContext,
	MyKey,
	OnKeyPressAction,
} from '../context/KeyPressActionContext.js';

function findAction(
	actions: OnKeyPressAction[],
	input: string,
	key: Key,
): OnKeyPressAction | undefined {
	for (const action of actions) {
		if (isMyKey(action.key)) {
			if (key[action.key as MyKey]) {
				return action;
			}
			continue;
		}

		if (typeof action.key === 'string') {
			if (input === action.key) {
				return action;
			}
			continue;
		}

		if (isCombination(action.key)) {
			const [mod, str] = action.key;
			if (key[mod] && input === str) {
				return action;
			}
			continue;
		}

		// list of them
		for (const actionKey of action.key) {
			if (isMyKey(actionKey)) {
				if (key[actionKey as MyKey]) {
					return action;
				}
				continue;
			}

			if (typeof actionKey === 'string') {
				if (input === actionKey) {
					return action;
				}
				continue;
			}

			if (isCombination(actionKey)) {
				const [mod, str] = actionKey;
				if (key[mod] && input === str) {
					return action;
				}
				continue;
			}
		}
	}

	return undefined;
}

export function useAllInput() {
	const {actions} = useContext(KeyPressActionContext);

	useInput((input, key) => {
		const action = findAction(actions, input, key);
		if (!action || !action.enabled || action.visible === false) return;

		action.action();
	});
}
