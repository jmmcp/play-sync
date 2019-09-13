class Session {
	constructor(creator) {
		this.clients = []; // all clients, including ones without users...
		this.users = [];
		this.creator = creator;
		this.countdownTime = -1;
		this.countdownName = "pause";
		this.countdownRequester = "";
		this.name = ""; // xCwL
		this.timerRunning = false;
	}

	addClient(clientId) {
		this.clients.push(clientId);
	}

	removeClient(clientId) {
		const i = this.clients.indexOf(clientId);
		if (i > -1) {
			this.clients.splice(i, 1);
		}
	}

	addUser(user) {
		this.users.push(user);
	}

	removeUser(user) {
		const i = this.users.indexOf(user);
		if (i > -1) {
			this.users.splice(i, 1);
		}
	}

	// get user for client id
	getUser(clientId) {
		return this.users.filter(user => user.id === clientId)[0];
	}
}

module.exports = Session;