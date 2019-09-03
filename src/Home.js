import React from 'react';
import { Redirect } from 'react-router-dom';
import openSocket from 'socket.io-client';


class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			socket: null,
			redirectTo: null
		};
	}

	componentDidMount() {
		console.log('mount home');
		let socket = openSocket(process.env.REACT_APP_SOCKET_HOST);
		this.setState({ socket: socket });
	}

	createNewSession() {
		const socket = this.state.socket;
		console.log('new session');
		socket.emit('new-session', null);

		socket.on('new-session-created', data => {
			//this.setState({redirectTo: `/${data.name}`});
			this.props.history.push('/'+data.name);
		});
	}

	render() {
		return (
			<div>
				<div>this is home</div>
				<button onClick={_ => this.createNewSession()}>New Session</button>
			</div>
		);
	}
}
export default Home;
