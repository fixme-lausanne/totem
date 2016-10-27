"use strict";

var text = process.argv[2] || "The space is open! Feel free to come!"

const message = {
	"title": "@Fixme",
	"text": text,
	"screens": [ 3, 2, 1, 0 ],
	"priority": 2,
	"blink": true,
	"duration": 600
}

const net = require('net');

const client = net.connect({ host: "192.168.130.228", port: 4000 }, () => {
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
