require('dotenv').config();
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import randomatic from 'randomatic';

import Session from './src/Session';
import User from './src/User';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let sessions = {};
let clientsInSessions = {}; // client.id : sessionid

io.on('connection', client => {
	client.on('new-session', data => {
		// make that new session
		client.emit('new-session-created', newSession(client.id));
	});
	client.on('session-page-reached', sessionid => {
		// does the session exist in the master object?
		client.emit('session-exists', sessionid in sessions);
		if (sessionid in sessions) {
			client.join(sessionid);
			clientsInSessions[client.id] = sessionid;
			getSessionOfClient(client.id).addClient(client.id);
			//console.log(clientsInSessions);
		}
	});

	// 'yes, your username is legit and you are now a real member of a session'
	// 'everyone in the session: this user just joined'
	client.on('username-out', username => {
		const user = new User(username, client.id);
		const sesh = getSessionOfClient(client.id);
		sesh.addUser(user);
		client.emit('username-in', username);
		sendSessionUpdate(sesh.name);
		client.to(sesh.name).emit('message', `User ${user.name} joined`);
		let log = `User ${user.name} connected to room ${sesh.name}`;
		console.log(log, `(total clients: ${sesh.clients.length})`);
	});

	client.on('pause-requested', _ => {
		// TODO: pause-requested
		let sesh = getSessionOfClient(client.id);
		if (sesh != undefined && !sesh.timerRunning) {
			const senderName = getSessionOfClient(client.id).name;
			sendTimerToRoom(senderName, 'pause');
		}
	});

	client.on('play-requested', _ => {
		// TODO: resume-requested
		let sesh = getSessionOfClient(client.id);
		if (sesh != undefined && !sesh.timerRunning) {
			const senderName = getSessionOfClient(client.id).name;
			sendTimerToRoom(senderName, 'play');
		}
	});

	client.on('timestamp-in', _ => {
		// TODO: timestamp-in
	});

	client.on('disconnect', _ => {
		if (client.id in clientsInSessions) {
			let sesh = getSessionOfClient(client.id);
			if (sesh != undefined) {
				const u = sesh.getUser(client.id);
				let log = u != undefined ?
					`User ${u.name} dc'd from room ${sesh.name}` :
					`User-less client ${client.id} dc'd from room ${sesh.name}`;
				console.log(log, `(total clients: ${sesh.clients.length})`);
				sesh.removeUser(u);
				sesh.removeClient(client.id);
				delete clientsInSessions[client.id];
				if (sesh.clients.length === 0) {
					console.log(
						`No clients on session ${sesh.name}, destroying.`
					);
					destroySession(sesh.name);
				}
				//console.log(clientsInSessions);
			}
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
	while (session.name in sessions) { // ensure unique
		session.name = nameGen();
	}
	sessions[session.name] = session;
	return session;
}

function sendSessionUpdate(sessionName) {
	io.to(sessionName).emit('session-update', sessions[sessionName]);
}

// takes either a string or a Session
function destroySession(s) {
	const seshId = typeof s === Session ? s.name : s;
	delete sessions[seshId];
}

function getSessionOfClient(clientId) {
	return sessions[clientsInSessions[clientId]];
}



async function sendTimerToRoom(room, countdownName, userName) {
	let setTimerRunning = (t) => {
		return new Promise((resolve, reject) => {
			sessions[room].timerRunning = t;
			resolve();
		})
	};

	let sendCount = (count) => {
		return new Promise((resolve, reject) => {
			if (!(room in sessions)) {
				reject();
				return;
			}
			sessions[room].countdownTime = count;
			sessions[room].countdownName = countdownName;
			sessions[room].countdownRequester = userName;
			io.to(room).emit('timer-update', sessions[room]);
			resolve();
		});
	};
	let delay = () => {
		return new Promise(resolve => setTimeout(resolve, 1000));
	}
	// this could be a for loop, but this kind of looks pretty.
	setTimerRunning(true)
		//.then(_ => sendCount(5)).then(delay)
		//.then(_ => sendCount(4)).then(delay)
		.then(_ => sendCount(3)).then(delay)
		.then(_ => sendCount(2)).then(delay)
		.then(_ => sendCount(1)).then(delay)
		.then(_ => sendCount(0)).then(delay)
		.then(_ => sendCount(-1))
		.then(_ => setTimerRunning(false))
		.catch(reason => {
			// it's likely that a room was closed
			// in the middle of a timer for it.
		});
}

server.listen(process.env.SOCKET_PORT, _ => {
	let rhost = server.address().address;
	let rport = server.address().port;
	console.log("socket listening on ", rhost + ":" + rport);
});
