import React from 'react';
import Rx from 'rx';
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
    this.wait = false;
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

    // Track the search box
    this.obsHighlightSearchbox = Rx.Observable
    .fromEvent(this.refs.scrollWrapper, 'scroll')
    .subscribe(() => {
      this.lastScrollTop = this.refs.scrollWrapper.scrollTop;
      if (this.wait === false) {
        window.requestAnimationFrame(() => {
          if (this.lastScrollTop > 0) {
            this.refs.searchWrapper.classList.add('shadow');
          } else {
            this.refs.searchWrapper.classList.remove('shadow');
          }
          this.wait = false;
        });
        this.wait = true;
      }
    });

    action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });

    // Hack the footer
    const oldFooter = document.getElementById('footer');
    const newFooter = document.getElementById('footer').cloneNode(true);
    oldFooter.style.display = 'none';
    document.querySelector('#repo-list-page #scroll-wrapper').appendChild(newFooter);
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
    this.obsHighlightSearchbox.dispose();
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
        <div
          ref="searchWrapper"
          id="search-wrapper"
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
        </div>
        <div
          ref="scrollWrapper"
          id="scroll-wrapper"
        >
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
      </div>
    );
  }
}
