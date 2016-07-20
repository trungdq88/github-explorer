import React from 'react';
import action, { ACTIONS } from '../../action/action.js';
import './style.less';

export default class MenuOpenStateHandler extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
      full: false,
    };
  }

  componentDidMount() {
    this.obsToggleNavMenu = action
    .filter(a => a.name === ACTIONS.TOGGLE_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: !this.state.open, full: false });
    });
    this.obsOpenNavMenu = action
    .filter(a => a.name === ACTIONS.OPEN_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: true, full: false });
    });
    this.obsFullNavMenu = action
    .filter(a => a.name === ACTIONS.FULL_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: true, full: true });
    });
    this.obsCloseNavMenu = action
    .filter(a => a.name === ACTIONS.CLOSE_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: false, full: false });
    });
  }

  componentWillUnmount() {
    this.obsOpenNavMenu.dispose();
    this.obsFullNavMenu.dispose();
    this.obsCloseNavMenu.dispose();
    this.obsToggleNavMenu.dispose();
  }

  render() {
    return (
      <input type="checkbox" id="nav-menu-open-checkbox" checked={this.state.open} />
    );
  }

}
