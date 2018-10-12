import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Checkin from './components/Checkin';
import Settings from './components/Settings';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App section">
					<div className="container">
						<div className="columns">
							<div className="column">
								<Link to="/settings">
									<button className="button">Settings</button>
								</Link>
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
