require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const randomatic = require('randomatic');

const Session = require('./src/Session');
const User = require('./src/User');
let sessions = {};
let clientsInSessions = {}; // client.id : sessionid

io.on('connection', client => {
	console.log('connection established to client');

	client.on('new-session', data => {
		// make that new session
		client.emit('new-session-created', newSession(client.id));
	});
	client.on('session-page-reached', sessionid => {
		//does the session exist in the master object?
		client.emit('session-exists', sessionid in sessions);
		if (sessionid in sessions) {
			client.join(sessionid);
			clientsInSessions[client.id] = sessionid;
			console.log(clientsInSessions);
		}
	});

	client.on('get-session', _ => {
		return sessions[clientsInSessions[client.id]];
	});

	client.on('pause-requested', _ => {
		// TODO: pause-requested
	});

	client.on('resume-requested', _ => {
		// TODO: resume-requested
	});

	client.on('timestamp-in', _ => {
		// TODO: timestamp-in
	});

	client.on('disconnect', _ => {
		console.log('client disconnected');
		if (client.id in clientsInSessions) {
			delete clientsInSessions[client.id];
			console.log(clientsInSessions);
		}
	});
});



function newSession(creatorId) {
	let session = new Session(creatorId);
	let nameGen = _ => {
		// for now lets do 4 characters in two cases
		// that's like... 24*2*4! or something
		return randomatic('Aa', 4);
	};
	session.name = nameGen();
	while (session.name in sessions) {
		session.name = nameGen();
	}
	sessions[session.name] = session;
	return session;
}
function destroySession(sessionid) {
	delete sessions[sessionid];
}

function delay(t) {
	return new Promise(resolve => setTimeout(resolve, t));
}

async function sendTimerToRoom(room, timerName) {
	const COUNT_AMOUNT = 5;

}

server.listen(process.env.SOCKET_PORT, _ => {
	let rhost = server.address().address;
	let rport = server.address().port;
	console.log("socket listening on ", rhost + ":" + rport);
});
