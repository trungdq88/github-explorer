import React from 'react';
import { Link } from 'react-router';
import './style.less';
import './img/user-photo.png';

export default (props) => (
  <div id="profile">

    <div id="user-profile">
      <div
        id="avatar"
        style={{ backgroundImage: `url("${props.profile.avatar_url}")` }}
      >
      </div>

      <div id="user-info">
        <div id="user-info-upper">
          <h1>{props.profile.name}</h1>
          <h2>{props.profile.login}</h2>
        </div>
        <div id="user-info-lower">
          <div className="round-btn">
            Follow
          </div>
        </div>
      </div>

    </div>

    <div id="user-bio">
      {props.profile.bio}
    </div>

    <div id="user-stats">
      <div className="stats-divider space-holder"></div>

      <div className="stats-block">
        <div className="stats-title">{props.profile.followers}</div>
        <div className="stats-description">Followers</div>
      </div>

      <div className="stats-divider"></div>

      <div className="stats-block">
        <div className="stats-title">{props.profile.public_repos}</div>
        <div className="stats-description">Public repos</div>
      </div>

      <div className="stats-divider"></div>

      <div className="stats-block">
        <div className="stats-title">{props.profile.following}</div>
        <div className="stats-description">Following</div>
      </div>

      <div className="stats-divider space-holder"></div>
    </div>

    <div id="view-repos">
      <Link
        to={`/user/${props.profile.login}/repos`}
        className="green-btn"
      >VIEW REPOSITORIES</Link>
    </div>

  </div>
);
