require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.use(express.static('build'));

server.listen(process.env.PORT, _ => {
	let rhost = server.address().address;
	let rport = server.address().port;
	console.log("static host serving on ", rhost + ":" + rport);
});