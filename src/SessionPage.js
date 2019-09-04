import React from 'react';
import openSocket from 'socket.io-client';
import User from './User';

// const io = openSocket('http://localhost:3030/');

class SessionPage extends React.Component {
	constructor() {
		super();

	}

	componentDidMount() {
		console.log('mount session');
		let socket = openSocket(process.env.REACT_APP_SOCKET_HOST);
		console.log(process.env.REACT_APP_SOCKET_HOST);
		this.setState({ socket: socket });
		// emit the url param
		socket.emit('session-page-reached', this.props.match.params.sessionid);
		socket.on('session-exists', exists => {
			if (exists) {
				console.log('it exists');
			} else {
				console.log('it doesn\'t exist');
			}
		});

		socket.on('user-joined', user => {
			//TODO: user-joined
		});

		socket.on('user-left', user => {
			//TODO: user-left
		});

		socket.on('timer-update', data => {
			//TODO: timer-update
		});

		socket.on('timestamp-in', data => {
			//TODO: timestamp-in
		});

		socket.on('')
	}

	render() {
		return (
			<div>this is session</div>
		);
	}
}
export default SessionPage;
