import {Box, useStdout} from 'ink';
import React from 'react';

export function CenteredBox({children}: {children: React.ReactNode}) {
	const {stdout} = useStdout();

	return (
		<Box
			height={stdout.rows - 4}
			width={stdout.columns - 2}
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
		>
			{children}
		</Box>
	);
}
