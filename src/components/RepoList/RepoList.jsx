import React from 'react';
import RepoItem from '../RepoItem/RepoItem.jsx';
import SearchInput from '../SearchInput/SearchInput.jsx';
import './style.less';
import action, { ACTIONS, actionFactory } from '../../action/action.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class RepoList extends React.Component {

  constructor() {
    super();
    this.state = {
      page: 1,
      repos: [],
      complete: false,
      showSearch: false,
      offsetTop: 0,
    };
  }

  componentDidMount() {
    this.obsUserReposComplete = action
    .filter(a => a.name === ACTIONS.USER_REPOS_COMPLETE)
    .subscribe(() => this.setState({ complete: true }));

    this.obsReceiveUserRepos = action
    .filter(a => a.name === ACTIONS.USER_REPOS_RECEIVED)
    .map(a => a.data)
    .subscribe(repos => {
      this.setState({ repos });
      action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION_DONE });
    });

    this.obsReceiveUserReposNextPage = action
    .filter(a => a.name === ACTIONS.USER_REPOS_NEXT_PAGE_RECEIVED)
    .map(a => a.data)
    .subscribe(paging => {
      this.setState({
        page: paging.page,
        repos: this.state.repos.concat(paging.repos),
      });
    });

    action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.setState({
        repos: [],
      });
      actionFactory.getUserRepos(nextProps.params.username);
    }
  }

  componentWillUnmount() {
    this.obsReceiveUserRepos.dispose();
    this.obsReceiveUserReposNextPage.dispose();
    this.obsUserReposComplete.dispose();
  }

  onTransitionWillStart(data) {
    this.setState({
      offsetTop: data.scrollTop,
    });
  }

  onTransitionDidEnd() {
    // Get user profile
    actionFactory.getUserRepos(this.props.params.username);

    // Show search, need a delay to trigger CSS animation
    setTimeout(() => this.setState({ showSearch: true }), 50);
  }

  render() {
    return (
      <div
        id="repo-list-page"
        className="transition-item"
        data-from-path={`/user/${this.props.params.username}`}
        style={{ top: this.state.offsetTop }}
      >
        <ReactCSSTransitionGroup
          transitionName="list"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {this.state.showSearch ?
            <SearchInput
              placeholder="Find a repository..."
              buttonText="SEARCH"
            /> : null}
        </ReactCSSTransitionGroup>
        <div id="repo-list">
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

        {!this.state.complete ?
          <div
            id="load-more"
            onClick={() => actionFactory
              .getUserReposNextPage(this.props.params.username, this.state.page)}
          >LOAD MORE</div>
        : null}
      </div>
    );
  }
}
