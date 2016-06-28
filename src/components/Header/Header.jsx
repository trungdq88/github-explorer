import React from 'react';
import './style.less';
import './img/hamberger-menu.png';
import './img/github-logo.png';
import './img/notification-icon.png';

import action, { ACTIONS } from '../../action/action.js';
import { Link } from 'react-router';

export default () => (
  <div id="header">
    <div id="hamberger-menu" onClick={() => action.onNext({ name: ACTIONS.TOGGLE_NAV_MENU })}></div>
    <Link to="/">
      <div id="brand-logo"></div>
    </Link>
    <div id="notification-icon"></div>
  </div>
);
