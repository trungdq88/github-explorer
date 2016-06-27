import React from 'react';
import './App.less';
import MainContent from './MainContent/MainContent.jsx';
import NavMenu from './NavMenu/NavMenu.jsx';
import action, { ACTIONS } from '../action/action.js';

export default class App extends React.Component {

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
      <div>
        <NavMenu open={this.state.open} />
        <MainContent open={this.state.open} full={this.state.full} />
      </div>
    );
  }
}
