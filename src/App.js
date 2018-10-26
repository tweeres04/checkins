import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import Loadable from 'react-loadable';

import LoadingScreen from './LoadingScreen';

function CheckinsLoadable(options) {
	return Loadable({
		loading: () => <LoadingScreen />,
		...options
	});
}

const Checkin = CheckinsLoadable({
	loader: () => import('./components/Checkin')
});

const History = CheckinsLoadable({
	loader: () => import('./components/History')
});

const Settings = CheckinsLoadable({
	loader: () => import('./components/Settings')
});

const Signin = CheckinsLoadable({
	loader: () => import('./components/Signin')
});

function NavItem({ children, to, exact }) {
	return (
		<Route
			path={to}
			exact={exact}
			children={({ match }) => (
				<li className={match ? 'is-active' : null}>
					<Link to={to}>{children}</Link>
				</li>
			)}
		/>
	);
}

class App extends Component {
	state = {
		loading: true,
		user: null
	};
	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.setState({ loading: false, user });
		});
	}
	render() {
		const { loading, user } = this.state;
		return (
			loading ||
			(user ? (
				<Router>
					<Fragment>
						<div className="App section">
							<div className="container">
								<div className="columns">
									<div className="column">
										<div className="tabs">
											<ul>
												<NavItem exact to="/">
													Checkin
												</NavItem>
												<NavItem to="/history">History</NavItem>
												<NavItem to="/settings">Settings</NavItem>
												<li>
													<a
														onClick={() => {
															firebase.auth().signOut();
														}}
													>
														Logout
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<Route exact path="/" component={Checkin} />
								<Route path="/history" component={History} />
								<Route path="/settings" component={Settings} />
							</div>
						</div>
						<div className="footer">
							<div className="content has-text-centered">
								<p>&copy; Tweeres Software</p>
								<p>
									Icon made by{' '}
									<a href="http://www.freepik.com" title="Freepik">
										Freepik
									</a>
								</p>
							</div>
						</div>
					</Fragment>
				</Router>
			) : (
				<Signin />
			))
		);
	}
}

export default App;
