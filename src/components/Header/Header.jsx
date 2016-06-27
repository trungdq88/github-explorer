import React from 'react';
import './style.less';
import './img/hamberger-menu.png';
import './img/github-logo.png';
import './img/notification-icon.png';

import action, { ACTIONS } from '../../action/action.js';

export default () => (
  <div id="nav-bar">
    <div id="hamberger-menu" onClick={() => action.onNext({ name: ACTIONS.TOGGLE_NAV_MENU })}></div>
    <div id="brand-logo"></div>
    <div id="notification-icon"></div>
  </div>
);
