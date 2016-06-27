import React from 'react';
import Header from '../Header/Header.jsx';
import Profile from '../Profile/Profile.jsx';
import PopularRepo from '../PopularRepo/PopularRepo.jsx';
import Footer from '../Footer/Footer.jsx';
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
        <Profile />
        <PopularRepo />
        <Footer />
      </div>
    );
  }
}
