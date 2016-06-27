import React from 'react';
import './App.less';
import NavBar from './NavBar/NavBar.jsx';
import Profile from './Profile/Profile.jsx';
import PopularRepo from './PopularRepo/PopularRepo.jsx';

export default () => (
  <div>
    <NavBar />
    <Profile />
    <PopularRepo />
  </div>
);
