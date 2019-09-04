class Session {
	constructor(creator) {
		this.clients = [];
		this.creator = creator;
		this.countdownTime = -1;
	}
}

module.exports = Session;