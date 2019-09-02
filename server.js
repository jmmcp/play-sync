const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Session = require('./Session');
let sessions = {};

io.on('connection', client => {
	console.log('connection established to client');
});


const port = process.env.SOCKET_PORT || 3001;
server.listen(port, _ => {
	console.log("listening on port", port);
});
