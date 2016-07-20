import React from 'react';
import action, { ACTIONS } from '../../action/action.js';
import './style.less';

export default class MenuOpenStateHandler extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    this.obsToggleNavMenu = action
    .filter(a => a.name === ACTIONS.TOGGLE_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: !this.state.open });
    });
    this.obsOpenNavMenu = action
    .filter(a => a.name === ACTIONS.OPEN_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: true });
    });
    this.obsCloseNavMenu = action
    .filter(a => a.name === ACTIONS.CLOSE_NAV_MENU)
    .subscribe(() => {
      this.setState({ open: false });
    });
  }

  componentWillUnmount() {
    this.obsOpenNavMenu.dispose();
    this.obsCloseNavMenu.dispose();
    this.obsToggleNavMenu.dispose();
  }

  render() {
    return (
      <input type="checkbox" id="nav-menu-open-checkbox" checked={this.state.open} />
    );
  }

}
