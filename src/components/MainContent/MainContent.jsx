import React from 'react';
// import Rx from 'rx';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import './style.less';
import classNames from 'classnames';
import PageTransition from '../PageTransition/PageTransition.jsx';

import action, { ACTIONS } from '../../action/action.js';

export default class MainContent extends React.Component {

  constructor() {
    super();
    this.state = {
      scrollTop: 0,
    };
    // this.wait = false;
    this.onPageLoad = this.onPageLoad.bind(this);
  }

  componentDidMount() {
    this.obsReceivedUserProfile = action
    .filter(a => a.name === ACTIONS.DETAIL_TRANSITION_DATA)
    .map(a => a.data)
    .subscribe(data => this.setState({ detailPageData: data }));
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
