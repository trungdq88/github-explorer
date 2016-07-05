import React from 'react';
import Rx from 'rx';
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
    const userProfile = action.filter(a => a.name === ACTIONS.USER_PROFILE_RECEIVED);
    const userRepos = action.filter(a => a.name === ACTIONS.USER_REPOS_RECEIVED);

    this.obsReceivedUserProfile = userProfile.map(a => a.data)
    .subscribe(profile => this.setState({ profile }));
    this.obsReceiveUserRepos = userRepos.map(a => a.data)
    .subscribe(repos => this.setState({ repos }));
    this.obsLoadDone = Rx.Observable.zip(userProfile, userRepos)
    .subscribe(() => action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION_DONE }));

    // Get user profile
    actionFactory.getUserProfile(this.props.params.username);
    actionFactory.getUserRepos(this.props.params.username);

    action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.setState({
        profile: {},
        repos: [],
      });
      actionFactory.getUserProfile(nextProps.params.username);
      actionFactory.getUserRepos(nextProps.params.username);

      action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });
    }
  }

  componentWillUnmount() {
    this.obsReceivedUserProfile.dispose();
    this.obsReceiveUserRepos.dispose();
    this.obsLoadDone.dispose();
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
