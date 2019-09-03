import React from 'react';
import openSocket from 'socket.io-client';

import NameSubmit from './NameSubmit';

class Session extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			socket: null,
			isValidSession: null,
			username: null
		};
		this.onNameSubmit = this.onNameSubmit.bind(this);
	}

	componentDidMount() {
		console.log('mount session');
		let socket = openSocket(process.env.REACT_APP_SOCKET_HOST);
		this.setState({ socket: socket });

		// make sure we're on the webpage for an actual session.
		console.log(this.props.match.params.sessionid);
		socket.emit('session-page-reached',
			this.props.match.params.sessionid);
		socket.on('session-exists', sessionExists => {
			this.setState({isValidSession: sessionExists});
		});
	}

	onNameSubmit(name) {
		console.log('submitted', name);
	}

	mainPage() {
		return(
			<div>
				<h1>You did it horray</h1>
				<NameSubmit onSubmit={this.onNameSubmit} />
			</div>
		);
	}

	render() {
		if(this.state.isValidSession === false) {
			return <div>not a real session</div>
		} else if (this.state.isValidSession === true) {
			return this.mainPage();
		}
		return <div>Loading...</div>;
	}
}
export default Session;