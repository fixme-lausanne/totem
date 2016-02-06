"use strict";

const message = {
	"title": "@Fixme",
	"text": "The space is open! Feel free to come!",
	"tags": [ '@Fixme', 'Twitter' ],
	"priority": 2,
	"blink": true,
	"duration": 600
}

const net = require('net');

const client = net.connect({ port: 3000 }, () => {
	console.log('connected to server!');
	client.write(JSON.stringify(message));
});

client.on('data', (data) => {
	console.log(data.toString());
	client.end();
});

client.on('end', () => {
	console.log('disconnected from server');
});
