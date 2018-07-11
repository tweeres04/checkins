import React, { Component } from 'react';
import './App.css';

class App extends Component {
	state = {
		messageState: ''
	};
	submit = () => {
		const { messageState } = this.state;
		console.log('This will submit', `'${messageState}'`);
		this.setState({ messageState: '' });
	};
	handleChange = ({ target: { value } }) => {
		this.setState({ messageState: value });
	};
	render() {
		const { messageState } = this.state;
		return (
			<div className="App">
				<h1>What did you work on today?</h1>
				<div>
					<textarea value={messageState} onChange={this.handleChange} />
				</div>
				<div>
					<button onClick={this.submit}>Submit</button>
				</div>
			</div>
		);
	}
}

export default App;
