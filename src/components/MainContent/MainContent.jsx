import React from 'react';
import Header from '../Header/Header.jsx';
import Profile from '../Profile/Profile.jsx';
import PopularRepo from '../PopularRepo/PopularRepo.jsx';
import Footer from '../Footer/Footer.jsx';
import './style.less';

import classNames from 'classnames';
import action, { ACTIONS } from '../../action/action.js';

export default class MainContent extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
      full: false,
    };
  }

  componentDidMount() {
    this._toggleNavMenu = action
    .filter(action => action.name === ACTIONS.TOGGLE_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: !this.state.open, full: false });
    });
    this._openNavMenu = action
    .filter(action => action.name === ACTIONS.OPEN_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: true, full: false });
    });
    this._fullNavMenu = action
    .filter(action => action.name === ACTIONS.FULL_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: true, full: true });
    });
    this._closeNavMenu = action
    .filter(action => action.name === ACTIONS.CLOSE_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: false, full: false });
    });
  }

  componentWillUnmount() {
    this._openNavMenu.dispose();
    this._fullNavMenu.dispose();
    this._closeNavMenu.dispose();
    this._toggleNavMenu.dispose();
  }

  render() {
    return (
      <div id="main-content" className={classNames({
        open: this.state.open,
        full: this.state.full,
      })}>
        <div id="menu-overlay" onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}></div>
        <Header />
        <Profile />
        <PopularRepo />
        <Footer />
      </div>
    );
  }
}
