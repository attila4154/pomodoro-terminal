import {useInput} from 'ink';
import {useContext} from 'react';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

export function useAllInput() {
	const {actions} = useContext(KeyPressActionContext);

	useInput(input => {
		const action = actions.find(a => a.key === input);
		if (!action || !action.enabled) return;

		action.action();
	});
}
