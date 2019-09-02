import React from 'react';
import { Redirect } from 'react-router-dom';
import openSocket from 'socket.io-client';


class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			socket: null,
			redirectTo: null
		};
	}

	componentDidMount() {
		this.setState({socket: openSocket(process.env.REACT_APP_SOCKET_HOST) });
	}

	createNewSession() {
		const socket = this.state.socket;
		console.log('new session');
		socket.emit('new-session', null);

		socket.on('new-session-created', data => {
			this.setState({redirectTo: `/${data.name}`});
		});
	}

	renderRedirect() {
		if(this.state.redirectTo === null) {
			return null;
		}  else {
			return <Redirect to={this.state.redirectTo} />;
		}
	}

	render() {
		return (
			<div>
				<div>this is home</div>
				<button onClick={this.createNewSession}>New Session</button>
				{this.renderRedirect()}
			</div>
		);
	}
}
export default Home;