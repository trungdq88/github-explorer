import React from 'react';
import RepoItem from '../RepoItem/RepoItem.jsx';
import SearchInput from '../SearchInput/SearchInput.jsx';
import './style.less';
import action, { ACTIONS, actionFactory } from '../../action/action.js';

export default class Repo extends React.Component {

  constructor() {
    super();
    this.state = {
      page: 1,
      repos: [],
    };
  }

  componentDidMount() {
    this.obsReceiveUserRepos = action
    .filter(a => a.name === ACTIONS.USER_REPOS_RECEIVED)
    .map(a => a.data)
    .subscribe(repos => this.setState({ repos }));

    this.obsReceiveUserReposNextPage = action
    .filter(a => a.name === ACTIONS.USER_REPOS_NEXT_PAGE_RECEIVED)
    .map(a => a.data)
    .subscribe(paging => {
      this.setState({
        page: paging.page,
        repos: this.state.repos.concat(paging.repos),
      });
    });

    // Get user profile
    actionFactory.getUserRepos(this.props.params.username);
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
  }

  render() {
    return (
      <div id="repo-list-page">
        <SearchInput
          placeholder="Find a repository..."
          buttonText="SEARCH"
        />
        <div id="repo-list">
          {this.state.repos.map(repo =>
            <RepoItem key={repo.id} {...repo} />
          )}
        </div>

        <div
          id="load-more"
          onClick={() => action.getUserReposNextPage(this.props.params.username, this.state.page)}
        >LOAD MORE</div>
      </div>
    );
  }
}
