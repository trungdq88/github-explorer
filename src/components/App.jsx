import React from 'react';
import './App.less';
import NavBar from './NavBar/NavBar.jsx';
import Profile from './Profile/Profile.jsx';
import PopularRepo from './PopularRepo/PopularRepo.jsx';
import Footer from './Footer/Footer.jsx';

export default () => (
  <div>
    <NavBar />
    <Profile />
    <PopularRepo />
    <Footer />
  </div>
);
