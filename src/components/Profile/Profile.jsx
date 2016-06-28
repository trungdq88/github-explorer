import React from 'react';
import { Link } from 'react-router';
import './style.less';
import './img/user-photo.png';
import action, { ACTIONS, actionFactory } from '../../action/action.js';

export default class Profile extends React.Component {

  constructor() {
    super();
    this.state = {
      profile: {},
    };
  }

  componentDidMount() {
    this.obsReceivedUserProfile = action
    .filter(a => a.name === ACTIONS.USER_PROFILE_RECEIVED)
    .map(a => a.data)
    .subscribe(profile => this.setState({ profile }));

    // Get user profile
    actionFactory.getUserProfile(this.props.params.username);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.setState({ profile: {} });
      actionFactory.getUserProfile(nextProps.params.username);
    }
  }

  componentWillUnmount() {
    this.obsReceivedUserProfile.dispose();
  }

  render() {
    return (
      <div id="profile">

        <div id="user-profile">
          <div
            id="avatar"
            style={{ backgroundImage: `url("${this.state.profile.avatar_url}")` }}
          ></div>

          <div id="user-info">
            <div id="user-info-upper">
              <h1>{this.state.profile.name}</h1>
              <h2>{this.state.profile.login}</h2>
            </div>
            <div id="user-info-lower">
              <div className="round-btn">
                Follow
              </div>
            </div>
          </div>

        </div>

        <div id="user-bio">
          {this.state.profile.bio}
        </div>

        <div id="user-stats">
          <div className="stats-divider space-holder"></div>

          <div className="stats-block">
            <div className="stats-title">{this.state.profile.followers}</div>
            <div className="stats-description">Followers</div>
          </div>

          <div className="stats-divider"></div>

          <div className="stats-block">
            <div className="stats-title">{this.state.profile.public_repos}</div>
            <div className="stats-description">Public repos</div>
          </div>

          <div className="stats-divider"></div>

          <div className="stats-block">
            <div className="stats-title">{this.state.profile.following}</div>
            <div className="stats-description">Following</div>
          </div>

          <div className="stats-divider space-holder"></div>
        </div>

        <div id="view-repos">
          <Link
            to={`/user/${this.props.params.username}/repos`}
            className="green-btn"
          >VIEW REPOSITORIES</Link>
        </div>

      </div>);
  }
}
