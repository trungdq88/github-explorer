import React from 'react';
import './style.less';
import './img/hamberger-menu.png';
import './img/github-logo.png';
import './img/notification-icon.png';

import action, { ACTIONS } from '../../action/action.js';
import { Link } from 'react-router';
import classNames from 'classnames';

export default (props) => (
  <div
    className={
      classNames('header', {
        fixed: props.fixed,
        hidden: props.open,
      })
    }
  >
    <div id="hamberger-menu" onClick={() => action.onNext({ name: ACTIONS.TOGGLE_NAV_MENU })}></div>
    <Link to="/">
      <div id="brand-logo"></div>
    </Link>
    <div id="notification-icon"></div>
  </div>
);
