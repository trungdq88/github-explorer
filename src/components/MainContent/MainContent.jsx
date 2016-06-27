import React from 'react';
import Header from '../Header/Header.jsx';
import Profile from '../Profile/Profile.jsx';
import PopularRepo from '../PopularRepo/PopularRepo.jsx';
import Footer from '../Footer/Footer.jsx';
import './style.less';

export default () => (
  <div id="main-content">
    <Header />
    <Profile />
    <PopularRepo />
    <Footer />
  </div>
);
