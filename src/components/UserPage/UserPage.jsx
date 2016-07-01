import React from 'react';
import Profile from '../Profile/Profile.jsx';
import RepoItem from '../RepoItem/RepoItem.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style.less';
import action, { ACTIONS, actionFactory } from '../../action/action.js';

export default class UserPage extends React.Component {

  constructor() {
    super();
    this.state = {
      profile: {},
      repos: [],
    };
  }

  componentDidMount() {
    this.obsReceivedUserProfile = action
    .filter(a => a.name === ACTIONS.USER_PROFILE_RECEIVED)
    .map(a => a.data)
    .map(profile => Object.assign({}, profile, {
      bio: profile.bio || ' ',
      followers: profile.followers || '0',
      public_repos: profile.public_repos || '0',
      following: profile.following || '0',
    }))
    .subscribe(profile => this.setState({ profile }));
    this.obsReceiveUserRepos = action
    .filter(a => a.name === ACTIONS.USER_REPOS_RECEIVED)
    .map(a => a.data)
    .subscribe(repos => this.setState({ repos }));

    // Get user profile
    actionFactory.getUserProfile(this.props.params.username);
    actionFactory.getUserRepos(this.props.params.username);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.setState({
        profile: {},
        repos: [],
      });
      actionFactory.getUserProfile(nextProps.params.username);
      actionFactory.getUserRepos(nextProps.params.username);
    }
  }

  componentWillUnmount() {
    this.obsReceivedUserProfile.dispose();
    this.obsReceiveUserRepos.dispose();
  }

  render() {
    return (
      <div id="user-page">
        <Profile profile={this.state.profile} />
        <div className="repo-list">
          <div className="repo-list-header">POPULAR REPOSITORIES</div>
          <div>
            <ReactCSSTransitionGroup
              transitionName="list"
              transitionAppear
              transitionAppearTimeout={500}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
              {this.state.repos.map(repo =>
                <RepoItem key={repo.id} {...repo} />
              )}
            </ReactCSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}
