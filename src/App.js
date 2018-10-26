import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import Loadable from 'react-loadable';

const Checkin = Loadable({
	loader: () => import('./components/Checkin'),
	loading: () => null
});

const History = Loadable({
	loader: () => import('./components/History'),
	loading: () => null
});

const Settings = Loadable({
	loader: () => import('./components/Settings'),
	loading: () => null
});

const Signin = Loadable({
	loader: () => import('./components/Signin'),
	loading: () => null
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
				</Router>
			) : (
				<Signin />
			))
		);
	}
}

export default App;
