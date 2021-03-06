if (Meteor.isServer) {
	let runningProcesses = {};
	let Fiber = Npm.require('fibers');

	Meteor.methods({
		launchProcess: function (id, command) {
			console.log('lauching ' + command);
			const spawn = Npm.require('child_process').spawn;

			if (runningProcesses[id]) {
				console.log("This process is already running.");
				return;
			}

			commandArr = command.split(' ');
			const program = commandArr.shift();
			const params = commandArr;

			try {
				let proc = spawn(program, params);
				runningProcesses[id] = proc;
				
				proc.stdout.on('data', (data) => {
					try {
						const msg = JSON.parse(data.toString());
						console.dir(msg);

						Fiber(function() {
							// Magic
							msg.screens = Screens.find({ tags: { $elemMatch: { value: { $in: msg.tags } } } }, { number: 1 }).map(screen => screen.number);
							Meteor.call('emitMsg', msg);
						}).run();
					} catch (e) {
						console.warn('Bad data:', e)
					}
				});

				proc.stderr.on('data', (data) => {
					console.error(`stderr (${command}): ${data}`);
				});

				proc.on('close', (code) => {
					console.log(`child process exited with code ${code}`);
					// TODO remove from runningProcesses
					delete runningProcesses[id];

					setTimeout(function () {
						Fiber(function() {
							Meteor.call('launchProcess', id, command);
						}).run();
					}, 5000);
				});
			} catch (e) {
				console.error(`Command ${command} failed: ${e}`);
			}
		}
	});
}
