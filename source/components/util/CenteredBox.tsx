import {Box, useStdout} from 'ink';
import React from 'react';

export function CenteredBox({children}: {children: React.ReactNode}) {
	const {stdout} = useStdout();

	return (
		<Box
			// todo: remove - 2
			height={stdout.rows}
			width={stdout.columns}
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
		>
			{children}
		</Box>
	);
}
