const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const randomatic = require('randomatic');

const Session = require('./Session');
let sessions = {};

io.on('connection', client => {
	console.log('connection established to client');

	client.on('new-session', data => {
		// make that new session
		client.emit('new-session-created', newSession());
	});
	client.on('session-page-reached', sessionid => {
		//does the session exist in the master object?
		client.emit('session-exists', sessionid in sessions);
		if(sessionid in sessions) {
			client.join(sessionid);
		}
	});

	client.on('disconnect', _ => {
		console.log('client disconnected');
	});
});



function newSession() {
	let session = new Session();
	let nameGen = _ => {
		// for now lets do 4 characters in two cases
		// that's like... 24*2*4! or something
		return randomatic('Aa', 4);
	};
	session.name = nameGen();
	while(session.name in sessions) {
		session.name = nameGen();
	}
	sessions[session.name] = session;
	return session;
}
function destroySession(sessionid) {

}


const port = process.env.SOCKET_PORT || 3001;
server.listen(port, "0.0.0.0", _ => {
	let rhost = server.address().address;
	let rport = server.address().port;
	console.log("listening on ", rhost+":"+rport);
});
