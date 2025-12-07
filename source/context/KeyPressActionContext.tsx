import React, {createContext, useCallback, useState} from 'react';

export type OnKeyPressAction = {
	key: string;
	enabled: boolean;
	description: string;
	action: () => void;
};

type Context = {
	actions: OnKeyPressAction[];
	register: (action: OnKeyPressAction) => void;
	unregister: (key: string) => void;
	unregisterAll: () => void;
};

const KeyPressActionContext = createContext<Context>({
	actions: [],
	register: () => {},
	unregister: () => {},
	unregisterAll: () => {},
});

function KeyPressActionProvider({children}: {children: React.ReactNode}) {
	const [actions, setActions] = useState<OnKeyPressAction[]>([]);

	const register = useCallback(
		(action: OnKeyPressAction) => {
			setActions(prev => [...prev, action]);
		},
		[setActions],
	);

	const unregister = useCallback((key: string) => {
		setActions(prev => {
			return prev.filter(p => p.key !== key);
		});
	}, []);

	const unregisterAll = useCallback(() => {
		setActions([]);
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
