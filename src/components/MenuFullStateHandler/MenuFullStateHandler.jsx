import React from 'react';
import action, { ACTIONS } from '../../action/action.js';
import './style.less';

export default class MenuFullStateHandler extends React.Component {

  constructor() {
    super();
    this.state = {
      full: false,
    };
  }

  componentDidMount() {
    this.obsFullNavMenu = action
    .filter(a => a.name === ACTIONS.FULL_NAV_MENU)
    .subscribe(() => {
      this.setState({ full: true });
    });
    this.obsCloseNavMenu = action
    .filter(a => a.name === ACTIONS.CLOSE_NAV_MENU || a.name === ACTIONS.OPEN_NAV_MENU)
    .subscribe(() => {
      this.setState({ full: false });
    });
  }

  componentWillUnmount() {
    this.obsFullNavMenu.dispose();
    this.obsCloseNavMenu.dispose();
  }

  render() {
    return (
      <input type="checkbox" id="nav-menu-full-checkbox" checked={this.state.full} />
    );
  }

}
