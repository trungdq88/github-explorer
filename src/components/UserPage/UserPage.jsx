import React from 'react';
import Rx from 'rx';
import Profile from '../Profile/Profile.jsx';
import RepoItem from '../RepoItem/RepoItem.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style.less';
import action, { ACTIONS, actionFactory } from '../../action/action.js';
import { Link } from 'react-router';

export default class UserPage extends React.Component {

  constructor() {
    super();
    this.state = {
      profile: {},
      repos: [],
    };
  }

  componentDidMount() {
    const userProfile = action.filter(a => a.name === ACTIONS.USER_PROFILE_RECEIVED);
    const userRepos = action.filter(a => a.name === ACTIONS.USER_PROFILE_REPOS_RECEIVED);

    this.obsReceivedUserProfile = userProfile.map(a => a.data)
    .subscribe(profile => this.setState({ profile }));
    this.obsReceiveUserRepos = userRepos.map(a => a.data)
    .subscribe(repos => this.setState({ repos }));
    this.obsLoadDone = Rx.Observable.zip(userProfile, userRepos)
    .subscribe(() => action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION_DONE }));

    this.loadUser(this.props.params.username);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.setState({
        profile: {},
        repos: [],
      });
      this.loadUser(nextProps.params.username);
    }
  }

  componentWillUnmount() {
    this.obsReceivedUserProfile.dispose();
    this.obsReceiveUserRepos.dispose();
    this.obsLoadDone.dispose();
  }

  loadUser(username) {
    if (username) {
      actionFactory.getUserProfile(username);
      actionFactory.getUserProfileRepos(username);
    } else {
      actionFactory.getRandomUser()
      .then(user => {
        actionFactory.getUserProfile(user.login);
        actionFactory.getUserProfileRepos(user.login);
      });
    }

    action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });
  }

  render() {
    return (
      <div id="user-page" className="transition-item">
        <Profile
          username={this.state.profile.login}
          profile={this.state.profile || {}}
        />
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
        <Link
          to={`/user/${this.state.profile.login}/repos`}
          className="view-all-btn"
        >
          VIEW ALL REPOS
        </Link>
      </div>
    );
  }
}
