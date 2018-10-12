import React, { Component } from 'react';
import firebase from 'firebase/app';
import classnames from 'classnames';
import formatDate from 'date-fns/format';

let userPromise;

class App extends Component {
	state = {
		entryText: '',
		submitting: false
	};
	componentDidMount() {
		userPromise = new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					resolve(user);
				} else {
					firebase
						.auth()
						.signInAnonymously()
						.catch(err => {
							console.error(err);
							reject(err);
						});
				}
			});
		});
	}
	submit = async () => {
		this.setState({ submitting: true });
		const { uid } = await userPromise;
		const { entryText } = this.state;

		const entry = {
			body: entryText,
			timestamp: new Date()
		};

		await firebase
			.firestore()
			.collection('users')
			.doc(uid)
			.collection('entries')
			.add(entry)
			.catch(err => {
				console.error(err);
				return;
			});

		this.setState({ entryText: '', submitting: false });
	};
	handleChange = ({ target: { value } }) => {
		this.setState({ entryText: value });
	};
	render() {
		const { entryText, submitting } = this.state;

		const submitButtonClasses = classnames(
			'button is-large is-fullwidth is-primary',
			{
				'is-loading': submitting
			}
		);

		const dateString = formatDate(new Date(), 'MMM D, YYYY');

		return (
			<div className="columns">
				<div className="column">
					<h1 className="title">{dateString} - What did you work on today?</h1>
					<div className="field">
						<div className="control">
							<textarea
								className="textarea"
								value={entryText}
								onChange={this.handleChange}
							/>
						</div>
					</div>
					<div className="field">
						<div className="control">
							<button
								className={submitButtonClasses}
								disabled={submitting}
								onClick={this.submit}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
