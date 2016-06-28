import React from 'react';
import Profile from '../Profile/Profile.jsx';
import PopularRepo from '../PopularRepo/PopularRepo.jsx';
import './style.less';

export default () => (
  <div id="user-page">
    <Profile />
    <PopularRepo />
  </div>
);
