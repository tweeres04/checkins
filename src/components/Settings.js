import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';

import update from 'immutability-helper';

import LoadingScreen from '../LoadingScreen';
import title from '../title';

function CheckinDefinition({ checkin, handleChange, removeCheckin }) {
	return (
		<Fragment>
			<label htmlFor="" className="label">
				Checkin at
			</label>
			<div className="field has-addons">
				<div className="control">
					<input
						className="input"
						type="text"
						value={checkin.time}
						onChange={handleChange}
					/>
				</div>
				<div className="control">
					<button
						disabled={!removeCheckin}
						className="button"
						onClick={() => {
							removeCheckin(checkin);
						}}
					>
						🗑
					</button>
				</div>
			</div>
		</Fragment>
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
		email: '',
		checkins: null
	};
	async componentDidMount() {
		document.title = title('Settings');
		firebase.auth().onAuthStateChanged(async user => {
			if (user) {
				const { uid } = user;
				const docSnapshot = await firebase
					.firestore()
					.doc(`users/${uid}`)
					.get();

				const snapshotData = docSnapshot.data();
				const email = snapshotData ? snapshotData.settings.email : '';
				const checkins = snapshotData
					? snapshotData.settings.checkins
					: [checkinFactory()];

				this.setState({ email, checkins, loading: false });
			}
		});
	}
	addCheckin = () => {
		let { checkins } = this.state;

		const newCheckin = { time: checkins[checkins.length - 1].time };

		checkins = [...checkins, newCheckin];

		this.setState({ checkins });
	};
	removeCheckin = checkin => {
		let { checkins } = this.state;

		const indexToRemove = checkins.indexOf(checkin);

		const statePatch = update(this.state, {
			checkins: { $splice: [[indexToRemove, 1]] }
		});

		this.setState(statePatch);
	};
	handleChangeEmail = ({ target: { value } }) => {
		this.setState({ email: value });
	};
	handleChangeCheckin = (time, i) => {
		const statePatch = update(this.state, {
			checkins: { [i]: { time: { $set: time } } }
		});
		this.setState(statePatch);
	};
	handleSubmit = async () => {
		const { email, checkins } = this.state;
		const { uid } = firebase.auth().currentUser;

		firebase
			.firestore()
			.doc(`users/${uid}`)
			.set({ settings: { email, checkins } });
	};
	render() {
		const { email, checkins, loading } = this.state;

		return loading ? (
			<LoadingScreen />
		) : (
			<Fragment>
				<h1 className="title">To what email would you like your checkins?</h1>
				<div className="columns">
					<div className="column">
						<div className="field">
							<label htmlFor="" className="label">
								Email
							</label>
							<div className="control">
								<input
									name="email"
									className="input"
									type="text"
									value={email}
									onChange={this.handleChangeEmail}
								/>
							</div>
						</div>
					</div>
				</div>
				<h1 className="title">When would you like your checkins?</h1>
				<h6 className="subtitle is-6">Times must be in 24 hour format (h:mm)</h6>
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
								removeCheckin={checkins.length > 1 && this.removeCheckin}
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
						<button
							className="button is-primary is-fullwidth is-medium"
							onClick={this.handleSubmit}
						>
							Save
						</button>
					</div>
				</div>
			</Fragment>
		);
	}
}
