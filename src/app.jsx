/**
 * Created by dinhquangtrung on 11/1/15.
 */

import './index.html';
import './third-party/bootstrap.js';
import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import UserPage from './components/UserPage/UserPage.jsx';
import RepoList from './components/RepoList/RepoList.jsx';
import RepoDetail from './components/RepoDetail/RepoDetail.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={UserPage} />
      <Route path="user/:username" component={UserPage} />
      <Route path="user/:username/repos" component={RepoList} />
      <Route path="user/:username/repos/:reponame" component={RepoDetail} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>, document.getElementById('root'));
