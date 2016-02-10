if (Meteor.isServer) {
	Meteor.methods({
		emitMsg: function (msg) {
			Meteor.call('emitJson', JSON.stringify(msg));
		},
		emitJson: function (json) {
			const net = Npm.require('net');

			try {
				const client = net.connect({ host: DISPATCHER_ADDRESS, port: DISPATCHER_PORT }, () => {
					console.log('connected to server!');
					client.write(json);
				});

				client.on('data', (data) => {
					console.log(data.toString());
					client.end();
				});

				client.on('end', () => {
					console.log('disconnected from server');
				});
			} catch (e) {
				console.error(`Cannot connect to dispatcher on port ${DISPATCHER_PORT}`);
			}
		}
	});
}
