import {exec, spawn} from 'child_process';
import notifier from 'node-notifier';

export function notify(msg: string) {
	notifier.notify({
		title: 'Pomodoro',
		message: msg,
		time: 100000,
	});
}

export function notifySound() {
	try {
		exec('afplay source/sounds/Frog.aiff');
	} catch {
		/* ignore */
	}
}

function runShortcut(name: string): Promise<boolean> {
	return new Promise(resolve => {
		try {
			const child = spawn('/usr/bin/shortcuts', ['run', name], {
				stdio: 'ignore',
				env: {
					...process.env,
					PATH: process.env['PATH'] + ':/usr/bin',
				},
			});

			child.on('close', () => resolve(true));
			child.on('error', () => resolve(false));
		} catch {
			resolve(false);
		}
	});
}

export function runEnableFocusShortcut(): Promise<boolean> {
	return runShortcut('Enable Focus');
}

export function runDisableFocusShortcut(): Promise<boolean> {
	return runShortcut('Disable Focus');
}

export function clearScreen() {
	process.stdout.write('\x1Bc'); // ANSI clear screen
}
