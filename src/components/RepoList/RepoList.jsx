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
      searchText: '',
      isSearching: false,
      complete: false,
      showSearch: false,
      offsetTop: 0,
    };
    this.wait = false;
    this.search = this.search.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.obsUserReposComplete = action
      .filter(a => a.name === ACTIONS.USER_REPOS_COMPLETE)
      .subscribe(() => this.setState({ complete: true }));

    this.obsReceiveUserRepos = action
      .filter(a => a.name === ACTIONS.USER_REPOS_RECEIVED)
      .map(a => a.data)
      .subscribe(repos => {
        this.setState({
          repos,
          isSearching: false,
          emptyData: repos.length === 0 && this.state.page === 1,
        });
        action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION_DONE });
      });

    this.obsReceiveUserReposNextPage = action
      .filter(a => a.name === ACTIONS.USER_REPOS_NEXT_PAGE_RECEIVED)
      .map(a => a.data)
      .subscribe(paging => {
        this.setState({
          page: paging.page,
          repos: this.state.repos.concat(paging.repos),
          isSearching: false,
        });
        action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION_DONE });
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username) {
      this.setState({
        repos: [],
      });
      actionFactory.searchUserRepos(
        this.props.params.username, this.state.searchText, this.state.page);
    }
  }

  componentWillUnmount() {
    this.obsReceiveUserRepos.dispose();
    this.obsReceiveUserReposNextPage.dispose();
    this.obsUserReposComplete.dispose();
    this.obsHighlightSearchbox.dispose();

    // Undo the footer hack in RepoList
    document.querySelector('.footer.original').style.display = 'flex';
  }

  onTransitionWillStart(data) {
    this.setState({
      offsetTop: data.scrollTop,
    });
  }

  onTransitionDidEnd() {
    this.setState({ offsetTop: 0 });

    action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });

    // Show search, need a delay to trigger CSS animation
    setTimeout(() => this.setState({ showSearch: true }), 50);

    setTimeout(() => {
      // Get user profile
      actionFactory.searchUserRepos(
        this.props.params.username, this.state.searchText, this.state.page);
    }, 300);

    // Hack the footer
    this.hackTheFooter();
  }

  hackTheFooter() {
    const oldFooter = document.querySelector('.footer');
    const newFooter = oldFooter.cloneNode(true);
    oldFooter.style.display = 'none';
    newFooter.classList.remove('original');
    document.querySelector('#repo-list-page #scroll-wrapper').appendChild(newFooter);
  }

  loadMore() {
    if (this.state.isSearching) return;
    this.setState({
      isSearching: true,
    }, () => {
      action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });
      actionFactory.searchUserRepos(
        this.props.params.username, this.state.searchText, this.state.page + 1);
    });
  }

  search() {
    if (this.state.isSearching) return;
    this.setState({
      page: 1,
      complete: false,
      isSearching: true,
      repos: [],
    }, () => {
      this.refs.scrollWrapper.scrollTop = 0;
      action.onNext({ name: ACTIONS.TRIGGER_LOAD_ANIMATION });
      actionFactory.searchUserRepos(
        this.props.params.username, this.state.searchText, this.state.page);
    });
  }

  render() {
    return (
      <div
        id="repo-list-page"
        className="transition-item"
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
                onChange={e => this.setState({ searchText: e.target.value })}
                onSearch={this.search}
              /> : null}
          </ReactCSSTransitionGroup>
        </div>
        <div
          ref="scrollWrapper"
          id="scroll-wrapper"
        >
          <div id="repo-list">
            {this.state.emptyData ?
              <div className="empty-data">:-( Sad... No result found!</div> :
              <div>
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

                {!this.state.complete && this.state.repos.length > 0 ?
                  <div
                    id="load-more"
                    onClick={this.loadMore}
                  >
                    {this.state.isSearching ? 'LOADING...' : 'LOAD MORE'}
                  </div>
                : null}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
