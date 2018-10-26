import React, { Component, Fragment } from 'react';
import firebase from 'firebase/app';
import Markdown from 'react-markdown';

import LoadingScreen from '../LoadingScreen';
import title from '../title';

class HistoryCard extends Component {
	state = { expanded: true };
	toggleExpanded = () => {
		this.setState({ expanded: !this.state.expanded });
	};
	render() {
		const {
			entry: { timestamp, body }
		} = this.props;
		const { expanded } = this.state;

		return (
			<div className="columns">
				<div className="column">
					<div className="card">
						<div
							className="card-header clickable"
							onClick={this.toggleExpanded}
						>
							<p className="card-header-title">
								{timestamp.toDate().toLocaleString()}
							</p>
							<span className="card-header-icon">{expanded ? '🔽' : '🔼'}</span>
						</div>
						{expanded && (
							<div className="card-content">
								<div className="content">
									<Markdown source={body} />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default class History extends Component {
	state = {
		loading: true,
		entries: null
	};
	async componentDidMount() {
		document.title = title('History');
		const { uid } = firebase.auth().currentUser;
		const entriesSnapshot = await firebase
			.firestore()
			.collection(`users/${uid}/entries`)
			.orderBy('timestamp', 'desc')
			.get();

		const entries = entriesSnapshot.docs.map(d => d.data());

		this.setState({ entries, loading: false });
	}
	render() {
		const { loading, entries } = this.state;
		return (
			<Fragment>
				<h1 className="title">History</h1>
				{loading ? (
					<LoadingScreen />
				) : (
					entries.map(e => (
						<HistoryCard entry={e} key={e.timestamp.toString()} />
					))
				)}
			</Fragment>
		);
	}
}
