import React from 'react';
import './App.less';
import Header from './Header/Header.jsx';
import Profile from './Profile/Profile.jsx';
import PopularRepo from './PopularRepo/PopularRepo.jsx';
import Footer from './Footer/Footer.jsx';

export default () => (
  <div>
    <Header />
    <Profile />
    <PopularRepo />
    <Footer />
  </div>
);
