import {Box, Text} from 'ink';
import React, {useContext} from 'react';
import {KeyPressActionContext} from '../context/KeyPressActionContext.js';

function ActionsFooter() {
	const {actions} = useContext(KeyPressActionContext);

	return (
		<Box height={1} borderTop justifyContent="center" gap={3}>
			{Object.entries(actions).map(([key, [description]]) => (
				<Text
					key={key}
					// bold={pressedButton === key}
					// dimColor={pressedButton === key}
				>
					[{key}]: {description}
				</Text>
			))}
		</Box>
	);
}

export {ActionsFooter};
