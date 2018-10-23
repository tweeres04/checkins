import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Checkin from './components/Checkin';
import Settings from './components/Settings';

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
	render() {
		return (
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
										<NavItem to="/settings">Settings</NavItem>
									</ul>
								</div>
							</div>
						</div>
						<Route exact path="/" component={Checkin} />
						<Route path="/settings" component={Settings} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
