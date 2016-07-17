import React from 'react';
// import Rx from 'rx';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import './style.less';
import classNames from 'classnames';
import PageTransition from 'react-router-page-transition';
import Toast from '../Toast/Toast.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import action, { ACTIONS } from '../../action/action.js';

export default class MainContent extends React.Component {

  constructor() {
    super();
    this.state = {
      scrollTop: 0,
      toast: null, // object shape: { message: 'example', timeout: 3000, button: <Example /> }
    };
    // this.wait = false;
    this.onPageLoad = this.onPageLoad.bind(this);
  }

  componentDidMount() {
    this.obsReceivedUserProfile = action
      .filter(a => a.name === ACTIONS.DETAIL_TRANSITION_DATA)
      .map(a => a.data)
      .subscribe(data => this.setState({ detailPageData: data }));
    this.obsShowToast = action
      .filter(a => a.name === ACTIONS.SHOW_TOAST)
      .map(a => a.data)
      .subscribe(data => {
        this.setState({ toast: data });
        if (+this.state.toast.timeout > 0) {
          setTimeout(() => {
            this.setState({ toast: null });
          }, this.state.toast.timeout);
        }
      });
  }

  componentWillReceiveProps() {
    this.setState({
      scrollTop: this.refs.scrollSection.scrollTop,
    });
  }

  componentWillUnmount() {
    // this.obsMoveHeader.dispose && this.obsMoveHeader.dispose();
  }

  onPageLoad() {
    // Caution: this force reflow
    this.refs.scrollSection.scrollTop = 0;
  }

  render() {
    return (
      <div
        id="main-content"
        className={classNames({
          open: this.props.open,
          full: this.props.full,
        })}
      >
        {this.state.toast ?
          <ReactCSSTransitionGroup
            transitionName="list"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            <Toast toast={this.state.toast} />
          </ReactCSSTransitionGroup>
          : null}
        <Header route={this.props.route} />
        <div
          id="scroll-section"
          ref="scrollSection"
        >
          <PageTransition
            timeout={300}
            onLoad={this.onPageLoad}
            data={{
              scrollTop: this.state.scrollTop,
              detailPageData: this.state.detailPageData,
            }}
          >
            {this.props.children}
          </PageTransition>
          <Footer />
        </div>
      </div>
    );
  }

}
