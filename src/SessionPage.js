import React from 'react';
import openSocket from 'socket.io-client';
import moment from 'moment';

import NameSubmit from './NameSubmit';
import MessageBox from './MessageBox';
import './SessionPage.scss';

const User = require('./User');
const Session = require('./Session');

// const io = openSocket('http://localhost:3030/');

class SessionPage extends React.Component {
	constructor() {
		super();

		this.state = {
			exists: null,
			username: null,
			session: new Session()
		}
		function loadAudio(name) {
			return new Audio(process.env.REACT_APP_WEB_HOST +
				"sounds/" + name + ".mp3");
		}

		this.socket = null;

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
		this.socket = openSocket(process.env.REACT_APP_SOCKET_HOST);
		console.log(process.env.REACT_APP_SOCKET_HOST);
		// emit the url param
		this.socket.emit('session-page-reached', this.props.match.params.sessionid);
		this.socket.on('session-exists', exists => {
			this.setState({ exists: exists });
		});

		this.socket.on('username-in', username => {
			this.setState({ username: username });
		});

		this.socket.on('session-update', session => {
			this.setState({ session: session });
		});

		this.socket.on('timer-update', session => {
			this.setState({ session: session });
			// is this where audio and stuff goes?
			const defaultTitle = `[${this.state.session.name}]`;
			if (session.countdownName === "play") {
				if (session.countdownTime > 0) {
					this.fxPlayDing.play();
					document.title = `[${session.countdownTime}] - PLAY`;
				} else if (session.countdownTime === 0) {
					this.fxPlayDingFinal.play();
					document.title = `[PLAY NOW]`;
				} else if (session.countdownTime === -1) {
					document.title = defaultTitle;
				}
			} else if (session.countdownName === "pause") {
				if (session.countdownTime > 0) {
					this.fxPauseDing.play();
					document.title = `[${session.countdownTime}] - PAUSE`;
				} else if (session.countdownTime === 0) {
					this.fxPauseDingFinal.play();
					document.title = `[PAUSE NOW]`;
				} else if (session.countdownTime === -1) {
					document.title = defaultTitle;
				}
			}

		});

		this.socket.on('timestamp-in', data => {
			//TODO: timestamp-in
		});

		this.socket.on('message', (content) => {
			this.messageBox.current.addMessage(content);
		});
	}

	componentWillUnmount() {
		this.socket.disconnect();
	}

	nameSubmitted(name) {
		this.socket.emit('username-out', name);
	}

	requestPause() {
		this.socket.emit('pause-requested');
	}

	requestPlay() {
		this.socket.emit('play-requested');
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
					<div>{this.state.session.countdownName}</div>
					<div>{this.state.session.countdownTime}</div>
					<div>{this.state.session.countdownRequester}</div>

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
