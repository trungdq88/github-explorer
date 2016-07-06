import React from 'react';
import './style.less';
import './img/github-logo.png';
import './img/notification-icon.png';

import action, { ACTIONS } from '../../action/action.js';
import { Link } from 'react-router';
import LoadingBlock from '../LoadingBlock/LoadingBlock.jsx';
import HamburgerIcon from '../HamburgerIcon/HamburgerIcon.jsx';
import { ROUTES } from '../../utils/routes.js';

export default class Header extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      showLoading: false,
      doneLoading: false,
    };
    this.shouldShowBackBtn = this.shouldShowBackBtn.bind(this);
    this.click = this.click.bind(this);
  }

  componentDidMount() {
    this.obsTriggerLoadAnimation = action
    .filter(a => a.name === ACTIONS.TRIGGER_LOAD_ANIMATION)
    .subscribe(() => {
      this.setState({ showLoading: true });
    });
    this.obsTriggerLoadAnimationDone = action
    .filter(a => a.name === ACTIONS.TRIGGER_LOAD_ANIMATION_DONE)
    .subscribe(() => {
      this.setState({ doneLoading: true });
      setTimeout(() => this.setState({
        showLoading: false,
        doneLoading: false,
      }), 600);
    });
  }

  componentWillUnmount() {
    this.obsTriggerLoadAnimation.dispose();
    this.obsTriggerLoadAnimationDone.dispose();
  }

  shouldShowBackBtn(route) {
    switch (route) {
      case ROUTES.HOME: return false;
      case ROUTES.USER_DETAIL: return false;
      case ROUTES.USER_REPO_LIST: return ROUTES.USER_DETAIL;
      case ROUTES.REPO_DETAIL: return ROUTES.USER_REPO_LIST;
      default: return false;
    }
  }

  click() {
    const backRoute = this.shouldShowBackBtn(this.props.route);
    if (backRoute) {
      action.onNext({ name: ACTIONS.BACK_BUTTON, data: backRoute });
    } else {
      action.onNext({ name: ACTIONS.TOGGLE_NAV_MENU });
    }
  }

  render() {
    return (
      <div>
        <div className="header">
          <HamburgerIcon
            open={this.props.open}
            back={this.shouldShowBackBtn(this.props.route)}
            id="hamberger-menu"
            onClick={this.click}
          />
          <Link to="/">
            <div id="brand-logo"></div>
          </Link>
          <div id="notification-icon"></div>
        </div>
        {this.state.showLoading ?
          <LoadingBlock done={this.state.doneLoading} /> : null}
      </div>
    );
  }
}
