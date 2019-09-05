import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

import Home from './Home';
import SessionPage from './SessionPage';
import './App.scss';

function App() {
	return (
		<div className="App">
			<div>app</div>
			<Router>
				<Route exact path="/" component={Home} />
				<Route path="/:sessionid" component={SessionPage} />
			</Router>
		</div>
	);
}

export default App;
