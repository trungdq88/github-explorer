import React from 'react';
import './App.less';
import './hamberger-menu.png';
import './github-logo.png';
import './notification-icon.png';
import './user-photo.png';

export default () => (
  <div>
    <div id="nav-bar">
      <div id="hamberger-menu"></div>
      <div id="brand-logo"></div>
      <div id="notification-icon"></div>
    </div>
    <div id="profile">

      <div id="user-profile">
        <div id="avatar"
          style={{ backgroundImage: 'url("/assets/user-photo.png")' }}></div>

        <div id="user-info">
          <div id="user-info-upper">
            <h1>Dinh Quang Trung</h1>
            <h2>trungdq88</h2>
          </div>
          <div id="user-info-lower">
            <div className="round-btn">
              Follow
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
);
