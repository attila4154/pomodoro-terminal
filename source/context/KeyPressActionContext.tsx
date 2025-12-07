import React, {createContext, useCallback, useState} from 'react';
import {OnKeyPressActions} from '../util/terminal.js';

type Context = {
	actions: OnKeyPressActions;
	register: (key: string, description: string, fn: () => void) => void;
	unregister: (key: string) => void;
	unregisterAll: () => void;
};

const KeyPressActionContext = createContext<Context>({
	actions: {},
	register: () => {},
	unregister: () => {},
	unregisterAll: () => {},
});

function KeyPressActionProvider({children}: {children: React.ReactNode}) {
	const [actions, setActions] = useState<OnKeyPressActions>({});

	const register = useCallback(
		(key: string, description: string, fn: () => void) => {
			setActions(prev => ({...prev, [key]: [description, fn]}));
		},
		[setActions],
	);

	const unregister = useCallback((key: string) => {
		setActions(prev => {
			const next = {...prev};
			delete next[key];
			return next;
		});
	}, []);

	const unregisterAll = useCallback(() => {
		setActions({});
	}, []);

	return (
		<KeyPressActionContext.Provider
			value={{actions, register, unregister, unregisterAll}}
		>
			{children}
		</KeyPressActionContext.Provider>
	);
}

export {KeyPressActionContext, KeyPressActionProvider};
