import React from 'react';
import openSocket from 'socket.io-client';
import moment from 'moment';

import User from './User';
import NameSubmit from './NameSubmit';

// const io = openSocket('http://localhost:3030/');

class SessionPage extends React.Component {
	constructor() {
		super();

		this.state = {
			exists: null,
			username: null,
			timer: {
				time: -1,
				name: ""
			}
		}

		this.nameSubmitted = this.nameSubmitted.bind(this);
		this.requestPause = this.requestPause.bind(this);
		this.requestPlay = this.requestPlay.bind(this);
	}

	componentDidMount() {
		console.log('mount session');
		let socket = openSocket(process.env.REACT_APP_SOCKET_HOST);
		console.log(process.env.REACT_APP_SOCKET_HOST);
		this.setState({ socket: socket });
		// emit the url param
		socket.emit('session-page-reached', this.props.match.params.sessionid);
		socket.on('session-exists', exists => {
			this.setState({ exists: exists });
		});

		socket.on('username-in', username => {
			this.setState({ username: username });
		});

		socket.on('user-joined', user => {
			//TODO: user-joined
		});

		socket.on('user-left', user => {
			//TODO: user-left
		});

		socket.on('timer-update', data => {
			this.setState({ timer: data });
			// is this where audio and stuff goes?
		});

		socket.on('timestamp-in', data => {
			//TODO: timestamp-in
		});
	}

	nameSubmitted(name) {
		this.state.socket.emit('username-out', name);
	}

	requestPause() {
		this.state.socket.emit('pause-requested');
	}

	requestPlay() {
		this.state.socket.emit('play-requested');
	}

	mainRender() {
		return (
			<div>
				{this.state.username === null ?
					<NameSubmit onSubmit={this.nameSubmitted} /> : null}
				<div>this is session</div>
				<button onClick={this.requestPause}>Request Pause</button>
				<button onClick={this.requestPlay}>Request Play</button>
				<div>
					<div>{this.state.timer.name}</div>
					<div>{this.state.timer.time}</div>
				</div>
			</div>
		);
	}

	render() {
		if (this.state.exists === null) {
			return <div>Connecting...</div>;
		} else if (this.state.exists === true) {
			return this.mainRender();
		} else if (this.state.exists === false) {
			return (
				<div>
					<div>Couldn't find session :v</div>
				</div>
			);
		}
	}
}
export default SessionPage;
