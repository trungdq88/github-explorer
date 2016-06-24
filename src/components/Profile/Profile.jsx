import React from 'react';
import './style.less';
import './img/user-photo.png';

export default () => (
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

    <div id="user-bio">
      “Write code, save the world.”
    </div>

    <div id="user-stats">
      <div className="stats-divider space-holder"></div>

      <div className="stats-block">
        <div className="stats-title">20</div>
        <div className="stats-description">Followers</div>
      </div>

      <div className="stats-divider"></div>

      <div className="stats-block">
        <div className="stats-title">141</div>
        <div className="stats-description">Starred</div>
      </div>

      <div className="stats-divider"></div>

      <div className="stats-block">
        <div className="stats-title">10</div>
        <div className="stats-description">Following</div>
      </div>

      <div className="stats-divider space-holder"></div>
    </div>

    <div id="view-repos">
      <a href="#" className="green-btn">VIEW REPOSITORIES</a>
    </div>

  </div>
);
