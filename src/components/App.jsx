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
      <div>
        <div
          id="menu-overlay"
          style={{ display: this.state.open && !this.state.full ? 'block' : 'none' }}
          onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}
        ></div>
        <NavMenu
          open={this.state.open}
          full={this.state.full}
        />
        <MainContent
          location={this.props.location}
          open={this.state.open}
          full={this.state.full}
        >
          {this.props.children}
        </MainContent>
      </div>
    );
  }
}
