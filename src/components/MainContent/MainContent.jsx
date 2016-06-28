import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import './style.less';
import classNames from 'classnames';

export default () => (
  <div
    id="main-content"
    className={classNames({
      open: this.props.open,
      full: this.props.full,
    })}
  >
    <Header />
    {this.props.children}
    <Footer />
  </div>
);
