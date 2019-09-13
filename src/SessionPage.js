import React from 'react';
import openSocket from 'socket.io-client';
import moment from 'moment';

import User from './User';
import NameSubmit from './NameSubmit';
import MessageBox from './MessageBox';
import './SessionPage.scss';



// const io = openSocket('http://localhost:3030/');

class SessionPage extends React.Component {
	constructor() {
		super();

		this.state = {
			exists: null,
			username: null,
			timer: {
				time: -1,
				name: "",
				userName: ""
			}
		}
		function loadAudio(name) {
			return new Audio(process.env.REACT_APP_WEB_HOST +
				"sounds/" + name + ".mp3");
		}
		this.fxPlayDing = loadAudio('play_ding');
		this.fxPauseDing = loadAudio('pause_ding');
		this.fxPlayDingFinal = loadAudio('play_ding_final');
		this.fxPauseDingFinal = loadAudio('pause_ding_final');

		this.messageBox = React.createRef();

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
			console.log(data);
			if (data.name === "play") {
				if (data.time > 0) {
					this.fxPlayDing.play();
					document.title = `[${data.time}] - PLAY`;
				} else if (data.time === 0) {
					this.fxPlayDingFinal.play();
					document.title = `[PLAY NOW]`;
				} else if (data.time === -1) {

				}
			} else if (data.name === "pause") {
				if (data.time > 0) {
					this.fxPauseDing.play();
					document.title = `[${data.time}] - PAUSE`;
				} else if (data.time === 0) {
					this.fxPauseDingFinal.play();
					document.title = `[PAUSE NOW]`;
				} else if (data.time === -1) {

				}
			}

		});

		socket.on('timestamp-in', data => {
			//TODO: timestamp-in
		});

		socket.on('message', (content) => {
			this.messageBox.current.addMessage(content);
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
			<div className="session-page">
				{this.state.username === null ?
					<NameSubmit onSubmit={this.nameSubmitted} /> : null}
				<div>this is session</div>
				<button className="req-button" onClick={this.requestPause}>Request Pause</button>
				<button className="req-button" onClick={this.requestPlay}>Request Play</button>
				<div>
					<div>{this.state.timer.name}</div>
					<div>{this.state.timer.userName}</div>
					<div>{this.state.timer.time}</div>

				</div>
				<MessageBox ref={this.messageBox} />
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
