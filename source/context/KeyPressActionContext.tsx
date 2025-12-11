import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';

export const KEYS = [
	'upArrow',
	'downArrow',
	'leftArrow',
	'rightArrow',
	'pageDown',
	'pageUp',
	'return',
	'escape',
	'ctrl',
	'shift',
	'tab',
	'backspace',
	'delete',
	'meta',
] as const;

export type MyKey = (typeof KEYS)[number];

export function isMyKey(value: unknown): value is MyKey {
	return KEYS.some(key => key === value);
}

export type Combination = [MyKey, string];

export function isCombination(value: unknown): value is Combination {
	return (
		Array.isArray(value) &&
		value.length === 2 &&
		isMyKey(value[0]) &&
		typeof value[1] === 'string'
	);
}

// export function isCombination(arg: ): arg is Combination {
// 	return Array.isArray(arg) && arg.length === 2 && typeof arg[1] === 'string';
// }

export type OnKeyPressAction = {
	key: string | Combination | MyKey | (string | Combination | MyKey)[];
	enabled: boolean;
	visible?: boolean;
	order: number;
	description: string;
	action: () => void;
};

type Context = {
	actions: OnKeyPressAction[];
	isTyping: boolean;
	register: (action: OnKeyPressAction) => void;
	unregister: ({
		description,
		key,
	}: {
		description?: string;
		key?: string;
	}) => void;
	unregisterAll: () => void;
	showAll: () => void;
	hideAll: () => void;
	setIsTyping: (t: boolean) => void;
};

const KeyPressActionContext = createContext<Context>({
	actions: [],
	isTyping: false,
	register: () => {},
	unregister: () => {},
	unregisterAll: () => {},
	showAll: () => {},
	hideAll: () => {},
	setIsTyping: () => {},
});

export function useIsTyping(enabled: boolean) {
	const {showAll, hideAll, setIsTyping} = useContext(KeyPressActionContext);

	useEffect(() => {
		if (enabled) {
			hideAll();
			setIsTyping(true);
		}

		return enabled
			? () => {
					showAll();
					setIsTyping(false);
			  }
			: () => {};
	}, [enabled]);
}

function KeyPressActionProvider({children}: {children: React.ReactNode}) {
	const [actions, setActions] = useState<OnKeyPressAction[]>([]);
	const [isTyping, setTyping] = useState(false);

	const register = useCallback(
		(action: OnKeyPressAction) => {
			setActions(prev => [...prev, action]);
		},
		[setActions],
	);

	const unregister = useCallback(
		({description, key}: {description?: string; key?: string}) => {
			if (key) {
				setActions(prev => {
					return prev.filter(p => p.key !== key);
				});
			}

			if (description) {
				setActions(prev => prev.filter(p => p.description !== description));
			}
		},
		[],
	);

	const unregisterAll = useCallback(() => {
		setActions([]);
	}, []);

	const hideAll = useCallback(() => {
		setActions(prev => prev.map(a => ({...a, visible: false})));
	}, []);

	const showAll = useCallback(() => {
		setActions(prev => prev.map(a => ({...a, visible: true})));
	}, []);

	const setIsTyping = useCallback((t: boolean) => {
		setTyping(t);
	}, []);

	return (
		<KeyPressActionContext.Provider
			value={{
				actions,
				isTyping,
				register,
				unregister,
				unregisterAll,
				hideAll,
				showAll,
				setIsTyping,
			}}
		>
			{children}
		</KeyPressActionContext.Provider>
	);
}

export {KeyPressActionContext, KeyPressActionProvider};
