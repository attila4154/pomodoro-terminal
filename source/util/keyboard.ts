import robot from 'robotjs';

// requires accessibility=true for the terminal from the os
export function toggleMusic() {
	robot.keyTap('audio_play');
}
