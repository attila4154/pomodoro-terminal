import notifier from 'node-notifier';

export function notify(msg: string) {
	process.stdout.write('\x07'); // ASCII bell
	notifier.notify({
		title: 'Pomodoro',
		message: msg,
		time: 100000,
	});
}

export function clearScreen() {
	process.stdout.write('\x1Bc'); // ANSI clear screen
}
