import React from 'react';

class NameSubmit extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};

		this.onChange = (event) => {

			this.setState({value: event.target.value.substring(0, 20)});
		};

		this.internalSubmit = (event) => {
			event.preventDefault();
			this.props.onSubmit(this.state.value);
		}
	}

	render() {
		return (
			<form onSubmit={this.internalSubmit}>
				<input type="text" value={this.state.value} onChange={this.onChange} />

				<input type="submit" value="Connect" />
			</form>
		);
	}
}
export default NameSubmit;