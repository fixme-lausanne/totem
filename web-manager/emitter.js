if (Meteor.isServer) {
	Meteor.methods({
		emitJson: function (json) {
			"use strict";

			const net = Npm.require('net');

			const client = net.connect({ port: 4000 }, () => {
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

		}
	});
}
