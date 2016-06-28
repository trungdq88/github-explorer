import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import './style.less';
import classNames from 'classnames';

export default (props) => (
  <div
    id="main-content"
    className={classNames({
      open: props.open,
      full: props.full,
    })}
  >
    <Header />
    {props.children}
    <Footer />
  </div>
);
