import React from 'react';
import './App.less';
import MainContent from './MainContent/MainContent.jsx';
import NavMenu from './NavMenu/NavMenu.jsx';
import action, { ACTIONS } from '../action/action.js';
import { matchParams } from '../utils/routes.js';
import classNames from 'classnames';

class App extends React.Component {

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
    this.obsBackButton = action
    .filter(a => a.name === ACTIONS.BACK_BUTTON)
    .subscribe(a => {
      const path = matchParams(a.data, this.props.params);
      this.context.router.push(path);
    });
  }

  componentWillUnmount() {
    this.obsOpenNavMenu.dispose();
    this.obsFullNavMenu.dispose();
    this.obsCloseNavMenu.dispose();
    this.obsToggleNavMenu.dispose();
    this.obsBackButton.dispose();
  }

  render() {
    return (
      <div>
        <div
          id="menu-overlay"
          className={classNames({ show: this.state.open && !this.state.full })}
          onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}
        ></div>
        <NavMenu
          open={this.state.open}
          full={this.state.full}
        />
        <MainContent
          route={this.props.routes[this.props.routes.length - 1].path}
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
App.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
export default App;
