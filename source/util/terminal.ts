import notifier from 'node-notifier';

export function notify() {
	// try {
	// 	exec(
	// 		`osascript -e 'display notification "Done cooking!" with title "Kitchen Terminal"'`,
	// 	);
	// } catch (e) {
	// 	console.log(e);
	// }

	process.stdout.write('\x07'); // ASCII bell
	notifier.notify({
		title: 'My notification',
		message: 'Hello, there!',
		time: 100000,
	});
}

export function clearScreen() {
	process.stdout.write('\x1Bc'); // ANSI clear screen
}
