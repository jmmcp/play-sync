import React from 'react';
import './NameSubmit.scss';

class NameSubmit extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: '',
			waitingOnUsernameIn: false
		};

		this.onChange = (event) => {

			this.setState({ value: event.target.value.substring(0, 20) });
		};

		this.internalSubmit = (event) => {
			event.preventDefault();
			this.setState({ waitingOnUsernameIn: true });
			this.props.onSubmit(this.state.value);
		}
	}

	formWrap() {
		return (
			<div className="form-wrap">
				<form onSubmit={this.internalSubmit}>
					<input type="text" value={this.state.value} onChange={this.onChange} />

					<input type="submit" value="Connect" />
				</form>
			</div>
		);
	}

	render() {
		return (
			<div className="name-submit-wrap">
				<div className="overlay"></div>
				{this.state.waitingOnUsernameIn ?
					<div className="connecting">Connecting...</div> :
					this.formWrap()
				}
			</div>
		);
	}
}
export default NameSubmit;