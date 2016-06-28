/**
 * Created by dinhquangtrung on 11/1/15.
 */

import './index.html';
import './third-party/bootstrap.js';
import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import UserPage from './components/UserPage/UserPage.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={UserPage} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>, document.getElementById('root'));
