import React from 'react';
import './style.less';
import './img/github-logo.png';
import './img/notification-icon.png';

import Rx from 'rx';
import action, { ACTIONS } from '../../action/action.js';
import { Link } from 'react-router';
import LoadingBlock from '../LoadingBlock/LoadingBlock.jsx';
import HamburgerIcon from '../HamburgerIcon/HamburgerIcon.jsx';
import { ROUTES } from '../../utils/routes.js';
import classNames from 'classnames';

export default class Header extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      showLoading: false,
      doneLoading: false,
      loadFailed: false,
    };
    this.shouldShowBackBtn = this.shouldShowBackBtn.bind(this);
    this.click = this.click.bind(this);
  }

  componentDidMount() {
    this.obsTriggerLoadAnimation = action
      .filter(a => a.name === ACTIONS.TRIGGER_LOAD_ANIMATION)
      .subscribe(() => {
        const load = () => {
          this.setState({ loadFailed: false, showLoading: true });
        };
        if (this.state.loadFailed) {
          this.setState({ showLoading: false }, () => load());
        } else {
          load();
        }
      });
    this.obsTriggerLoadAnimationDone = action
      .filter(a => a.name === ACTIONS.TRIGGER_LOAD_ANIMATION_DONE)
      .subscribe(() => {
        this.setState({ loadFailed: false, doneLoading: true });
        setTimeout(() => this.setState({
          showLoading: false,
          doneLoading: false,
          loadFailed: false,
        }), 600);
      });
    this.obsRequestFailed = action
      .filter(a => a.name === ACTIONS.REQUEST_FAILED)
      .subscribe(() => {
        this.setState({ loadFailed: true });
      });

    if (this.isUserPage(this.props.route)) {
      this.mountHeaderChange();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.isUserPage(nextProps.route)) {
      this.unmountHeaderChange();
    } else {
      this.mountHeaderChange();
    }
  }

  componentWillUnmount() {
    this.obsTriggerLoadAnimation.dispose();
    this.obsTriggerLoadAnimationDone.dispose();
    this.obsRequestFailed.dispose();
    this.unmountHeaderChange();
  }

  unmountHeaderChange() {
    this.refs.header.classList.remove('transparent');
    this.obsChangeHeaderColor && this.obsChangeHeaderColor.dispose();
  }

  mountHeaderChange() {
    this.unmountHeaderChange(); // Make sure there is no multiple mount
    this.refs.header.classList.add('transparent');
    this.scrollSection = document.getElementById('scroll-section');
    this.wait = false;
    this.obsChangeHeaderColor = Rx.Observable
    .fromEvent(this.scrollSection, 'scroll')
    .subscribe(() => {
      this.lastScrollTop = this.scrollSection.scrollTop;
      if (this.wait === false) {
        window.requestAnimationFrame(() => {
          // Access direct to the DOM for better scrolling performance
          if (this.lastScrollTop === 0) {
            this.refs.header.classList.add('transparent');
          } else {
            this.refs.header.classList.remove('transparent');
          }
          this.wait = false;
        });
        this.wait = true;
      }
    });
  }

  isUserPage(route) {
    return route === undefined || // React Router returns undefined on root?
      route === ROUTES.USER_DETAIL ||
        route === ROUTES.HOME;
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
        <div
          ref="header"
          className={classNames('header')}
        >
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
          <LoadingBlock
            done={this.state.doneLoading}
            failed={this.state.loadFailed}
          /> : null}
      </div>
    );
  }
}
