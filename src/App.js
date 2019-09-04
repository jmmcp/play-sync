import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

import Home from './Home';
import Session from './Session';
import './App.scss';

function App() {
  return (
    <div className="App">
      <div>cool</div>
      <Router>
        <Route exact path="/" component={Home} />
        <Route path="/:sessionid" component={Session} />
      </Router>
    </div>
  );
}

export default App;
