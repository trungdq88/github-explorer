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

    // this.headerDOM = document.querySelector('.header.fixed');
    // this.headerDOM.classList.remove('user-page');
    //
    // if (this.refs.mainContent.classList.contains('user-page')) {
    //   this.obsMoveHeader = Rx.Observable
    //   .fromEvent(this.refs.mainContent, 'scroll')
    //   .subscribe(() => {
    //     this.lastScrollTop = this.refs.mainContent.scrollTop;
    //     if (this.wait === false) {
    //       window.requestAnimationFrame(() => {
    //         // Access direct to the DOM for better scrolling performance
    //         if (this.lastScrollTop === 0) {
    //           this.headerDOM.classList.add('transparent');
    //         } else {
    //           this.headerDOM.classList.remove('transparent');
    //         }
    //         this.wait = false;
    //       });
    //       this.wait = true;
    //     }
    //   });
    // } else {
    //   this.headerDOM.classList.remove('transparent');
    // }
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
        {/* <Header open={this.props.open} /> */}
        <Header />
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
