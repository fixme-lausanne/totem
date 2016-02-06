"use strict";

const spawn = require('child_process').spawn;

const pythonProcesses = [];

function print(screenId, string) {
	if (pythonProcesses[screenId]) {
		console.log("A process already exist for this screen. Killing it.")
		pythonProcesses[screenId].kill('SIGHUP'); // TODO nice sync with the `proc.on('close')`
	}

	// let proc = spawn('python', ['print_lcd.py', screenId, string]);
	let proc = spawn('node', ['print_lcd_test.js', screenId, string]);
	pythonProcesses[screenId] = proc;

	proc.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	proc.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`);
	});

	proc.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
}

// Tests
print(0, "Hello Fixme!");
print(1, "Hoy mate?");

setTimeout(() => {
	print(0, "Yo!");
	print(2, "oh?");
}, 3000)