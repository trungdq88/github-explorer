import React from 'react';
import './App.less';
import MainContent from './MainContent/MainContent.jsx';
import MenuOpenStateHandler from './MenuOpenStateHandler/MenuOpenStateHandler.jsx';
import MenuFullStateHandler from './MenuFullStateHandler/MenuFullStateHandler.jsx';
import NavMenu from './NavMenu/NavMenu.jsx';
import action, { ACTIONS } from '../action/action.js';
import { matchParams } from '../utils/routes.js';

class App extends React.Component {

  componentDidMount() {
    this.obsBackButton = action
    .filter(a => a.name === ACTIONS.BACK_BUTTON)
    .subscribe(a => {
      const path = matchParams(a.data, this.props.params);
      this.context.router.push(path);
    });
  }

  componentWillUnmount() {
    this.obsBackButton.dispose();
  }

  render() {
    return (
      <div>
        <MenuOpenStateHandler />
        <MenuFullStateHandler />
        <div
          id="menu-overlay"
          onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}
        ></div>
        <NavMenu />
        <MainContent
          route={this.props.routes[this.props.routes.length - 1].path}
          location={this.props.location}
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
