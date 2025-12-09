import React, {createContext, useCallback, useState} from 'react';

export type OnKeyPressAction = {
	key: string;
	enabled: boolean;
	visible?: boolean;
	order: number;
	description: string;
	action: () => void;
};

type Context = {
	actions: OnKeyPressAction[];
	register: (action: OnKeyPressAction) => void;
	unregister: (key: string) => void;
	unregisterAll: () => void;
	showAll: () => void;
	hideAll: () => void;
};

const KeyPressActionContext = createContext<Context>({
	actions: [],
	register: () => {},
	unregister: () => {},
	unregisterAll: () => {},
	showAll: () => {},
	hideAll: () => {},
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

	const hideAll = useCallback(() => {
		setActions(prev => prev.map(a => ({...a, visible: false})));
	}, []);

	const showAll = useCallback(() => {
		setActions(prev => prev.map(a => ({...a, visible: true})));
	}, []);

	return (
		<KeyPressActionContext.Provider
			value={{
				actions,
				register,
				unregister,
				unregisterAll,
				hideAll,
				showAll,
			}}
		>
			{children}
		</KeyPressActionContext.Provider>
	);
}

export {KeyPressActionContext, KeyPressActionProvider};
