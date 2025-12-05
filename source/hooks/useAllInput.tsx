import {useInput} from 'ink';
import {useContext} from 'react';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

export function useAllInput() {
	const {actions} = useContext(KeyPressActionContext);

	useInput(input => {
		const action = actions[input];
		if (!action) return;

		action[1]();
	});
}
