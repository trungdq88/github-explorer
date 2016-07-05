import React from 'react';
import './style.less';
import './img/hamberger-menu.png';
import './img/github-logo.png';
import './img/notification-icon.png';

import action, { ACTIONS } from '../../action/action.js';
import { Link } from 'react-router';
import LoadingBlock from '../LoadingBlock/LoadingBlock.jsx';
import classNames from 'classnames';

export default class Header extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      showLoading: false,
      doneLoading: false,
    };
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

  render() {
    return (
      <div>
        <div
          className={
            classNames('header', {
              fixed: this.props.fixed,
              hidden: this.props.open,
            })
          }
        >
          <div
            id="hamberger-menu"
            onClick={() => action.onNext({ name: ACTIONS.TOGGLE_NAV_MENU })}
          ></div>
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
