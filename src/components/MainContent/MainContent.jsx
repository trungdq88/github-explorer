import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import UserPage from '../UserPage/UserPage.jsx';
import './style.less';

import classNames from 'classnames';

export default class MainContent extends React.Component {
  render() {
    return (
      <div id="main-content" className={classNames({
        open: this.props.open,
        full: this.props.full,
      })}>
        <Header />
        <UserPage />
        <Footer />
      </div>
    );
  }
}
