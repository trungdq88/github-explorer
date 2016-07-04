import React from 'react';
// import Rx from 'rx';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import './style.less';
import classNames from 'classnames';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

export default class MainContent extends React.Component {

  // constructor() {
  //   super();
  //   this.wait = false;
  // }

  componentDidMount() {
    // this.headerDOM = document.getElementById('header');
    // Move search bar
    // this.obsMoveHeader = Rx.Observable
    // .fromEvent(this.refs.mainContent, 'scroll')
    // .subscribe(() => {
    //   this.lastScrollTop = this.refs.mainContent.scrollTop;
    //   if (this.wait === false) {
    //     window.requestAnimationFrame(() => {
    //       // Access direct to the DOM for better scrolling performance
    //       this.headerDOM.style.transform =
    //         `translate3d(0, ${this.lastScrollTop}px, 0)`;
    //       this.headerDOM.className =
    //         this.lastScrollTop === 0 ? 'transparent' : '';
    //       this.wait = false;
    //     });
    //     this.wait = true;
    //   }
    // });
  }

  componentWillReceiveProps(nextProps) {
    // Scroll to top when switch page
    if (nextProps.children !== this.props.children) {
      this.refs.mainContent.scrollTop = 0;
    }
  }

  componentWillUnmount() {
    // this.obsMoveHeader.dispose();
  }

  render() {
    return (
      <div
        ref="mainContent"
        id="main-content"
        className={classNames({
          open: this.props.open,
          full: this.props.full,
        })}
      >
        <Header />
        <ReactCSSTransitionReplace
          transitionName="cross-fade"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {this.props.children}
        </ReactCSSTransitionReplace>
        <Footer />
      </div>
    );
  }

}
