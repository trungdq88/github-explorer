/**
 * Created by dinhquangtrung on 11/1/15.
 */

import './utils/sw-registration.js';
import './index.html';
import './third-party/bootstrap.js';
import './inspectocat.png';
import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import UserPage from './components/UserPage/UserPage.jsx';
import RepoList from './components/RepoList/RepoList.jsx';
import RepoDetail from './components/RepoDetail/RepoDetail.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { ROUTES } from './utils/routes.js';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path={ROUTES.HOME} component={App}>
      <IndexRoute component={UserPage} />
      <Route path={ROUTES.USER_DETAIL} component={UserPage} />
      <Route path={ROUTES.USER_REPO_LIST} component={RepoList} />
      <Route path={ROUTES.REPO_DETAIL} component={RepoDetail} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>, document.getElementById('root'));
