import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';

import update from 'immutability-helper';

function CheckinDefinition({ checkin, handleChange }) {
	return (
		<div className="field">
			<label htmlFor="" className="label">
				Checkin at
			</label>
			<div className="control">
				<input
					className="input"
					type="text"
					value={checkin.time}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
}

function checkinFactory() {
	return {
		time: '17:00'
	};
}

export default class Settings extends Component {
	state = {
		loading: true,
		checkins: null
	};
	async componentDidMount() {
		firebase.auth().onAuthStateChanged(async user => {
			if (user) {
				const { uid } = user;
				const docSnapshot = await firebase
					.firestore()
					.doc(`users/${uid}`)
					.get();

				let checkins;
				if (docSnapshot.exists) {
					checkins = docSnapshot.data().settings.checkins;
				} else {
					checkins = [checkinFactory()];
				}

				this.setState({ checkins, loading: false });
			}
		});
	}
	addCheckin = () => {
		let { checkins } = this.state;

		const newCheckin = { time: checkins[checkins.length - 1].time };

		checkins = [...checkins, newCheckin];

		this.setState({ checkins });
	};
	handleChangeCheckin = (time, i) => {
		const statePatch = update(this.state, {
			checkins: { [i]: { time: { $set: time } } }
		});
		this.setState(statePatch);
	};
	handleSubmit = async () => {
		const { checkins } = this.state;
		const { uid } = firebase.auth().currentUser;

		firebase
			.firestore()
			.doc(`users/${uid}`)
			.set({ settings: { checkins } });

		console.log('Saved');
		console.table(checkins);
	};
	render() {
		const { checkins, loading } = this.state;
		return (
			loading || (
				<Fragment>
					<h1 className="title">When would you like your checkins?</h1>
					<div className="columns">
						<div className="column">
							<button className="button" onClick={this.addCheckin}>
								Add checkin
							</button>
						</div>
					</div>
					<div className="columns">
						<div className="column">
							{checkins.map((c, i) => (
								<CheckinDefinition
									checkin={c}
									key={i}
									handleChange={({ target: { value } }) => {
										this.handleChangeCheckin(value, i);
									}}
								/>
							))}
						</div>
					</div>
					<div className="columns">
						<div className="column">
							<button className="button is-primary" onClick={this.handleSubmit}>
								Save
							</button>
						</div>
					</div>
				</Fragment>
			)
		);
	}
}
