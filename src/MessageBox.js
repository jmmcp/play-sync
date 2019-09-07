import React from 'react';
import moment from 'moment';
import './MessageBox.scss';

class Message {
	constructor(content) {
		this.time = moment();
		this.content = content;
	}
}

class MessageBox extends React.Component {

	constructor() {
		super();
		this.state = {
			messages: []
		};
	}

	componentDidMount() {
		this.addMessage("im about to enter sicko mode a");
		this.addMessage("im about to enter sicko mode b");
		this.addMessage("im about to enter sicko mode c");
		this.addMessage("im about to enter sicko mode d");
		this.addMessage("im about to enter sicko mode e");
		this.addMessage("im about to enter sicko mode f");
		this.addMessage("im about to enter sicko mode g");
		this.addMessage("im about to enter sicko mode h");
		this.addMessage("im about to enter sicko mode i");
		this.addMessage("im about to enter sicko mode j");
		this.addMessage("im about to enter sicko mode k");
		this.addMessage("im about to enter sicko mode l");
		this.addMessage("im about to enter sicko mode m");
	}

	addMessage(content) {
		this.state.messages.unshift(new Message(content));
		this.setState(this.state); // will this really work lol?
	}

	renderMessage(message) {
		return (
			<div className="message">
				<span className="time">{message.time.format("hh:mm")}</span>
				<span className="content">{message.content}</span>
			</div>
		);
	}

	render() {
		var messageList = [];
		for (const msg of this.state.messages) {
			messageList.unshift(this.renderMessage(msg))
		}
		return (
			<div className="message-box-wrap">
				<div className="message-box">
					{messageList}
				</div>
			</div>
		)
	}
}

export default MessageBox;