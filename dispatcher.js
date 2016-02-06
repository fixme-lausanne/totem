"use strict";

/*
{
	"title": "@Fixme",
	"text": "The space is open! Feel free to come!",
	"tags": [ '@Fixme', 'Twitter' ],
	"priority": 2,
	"blink": true,
	"duration": 600
}
*/

const port = process.argv[2] || 4000;

const net = require('net');
const spawn = require('child_process').spawn;

var server = net.createServer((socket) => {
	socket.on('data', (data) => {
		try {
			const msg = JSON.parse(data.toString());
			console.dir(msg);

			print(0, msg.text);

			socket.end('goodbye\n');
		} catch (e) {
			console.warn('Bad data:', e)
			socket.end('Don\'t send bad JSON: ' + e);
		}
	})
});

server.listen({
	port: port
}, () => {
	console.log('Server started, listening on %j. You can change this port by specifing the 1 argument of this program.', server.address());
});

// Process Spawner
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
/*
print(0, "Hello Fixme!");
print(1, "Hoy mate?");

setTimeout(() => {
	print(0, "Yo!");
	print(2, "oh?");
}, 3000)
*/
