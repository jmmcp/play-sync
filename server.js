const io = require('socket.io')();


io.on('connection', client => {
	
});


const port = process.env.PORT || 3000;
io.listen(port);
console.log("listening on port ", port);