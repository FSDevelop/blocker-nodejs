// Some importants requires
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socket = require('socket.io')(server);
var fs = require('fs');

// Players connected (with name, position, sprite, etc);
var players = new Array();
var shots = new Array();
var walls;

// On player connected
socket.on('connection', function(client) {
	
});

app.get('/blocker', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Listening to the port 8080 http://localhost:8080/blocker
server.listen(8080, function() {
	console.log('Waiting for players...');
});