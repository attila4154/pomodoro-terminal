import {exec} from 'child_process';
import notifier from 'node-notifier';

export function notify(msg: string) {
	process.stdout.write('\x07'); // ASCII bell
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

export function clearScreen() {
	process.stdout.write('\x1Bc'); // ANSI clear screen
}
