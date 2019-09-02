import React from 'react';
import openSocket from 'socket.io-client';


class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			endpoint: 'http://localhost:3001/'
		};
	}

	componentDidMount() {
		const {endpoint} = this.state;
		const socket = openSocket(endpoint);
	}

	render() {
		return (
			<div>this is home</div>
		);
	}
}
export default Home;