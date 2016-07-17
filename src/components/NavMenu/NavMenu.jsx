import React from 'react';
import Rx from 'rx';
import classNames from 'classnames';
import SearchInput from '../SearchInput/SearchInput.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Image from '../Image/Image.jsx';
import './style.less';

import action, { ACTIONS, actionFactory } from '../../action/action.js';

export default class NavMenu extends React.Component {

  constructor() {
    super();
    this.state = {
      searchText: '',
      users: [],
      searching: true,
    };

    this.wait = false;

    this.obsSearchTextChange = new Rx.Subject();

    this.onSearchTextChange = this.onSearchTextChange.bind(this);
  }

  componentDidMount() {
    this.obsCancelSearch = action
      .filter(a => a.name === ACTIONS.OPEN_NAV_MENU)
      .subscribe(() => {
        this.setState({ searchText: '' });
      });
    this.obsReceiveUsers = action
      .filter(a => a.name === ACTIONS.USERS_RECEIVED)
      .map(a => a.data)
      .subscribe(users => {
        this.setState({ users, searching: false });
      });
    this.obsTriggerTextChange = this.obsSearchTextChange
      .debounce(1000)
      .distinctUntilChanged()
      .flatMap(text => {
        this.setState({ searching: true });
        return Rx.Observable.fromPromise(actionFactory.getUsers(text))
          .takeUntil(this.obsSearchTextChange);
      })
      .subscribe(() => this.setState({ searching: false }));

    // Send get users request
    actionFactory.getUsers();

    // Highlight search bar
    this.obsHighlightSearchbar = Rx.Observable
      .fromEvent(this.refs.userList, 'scroll')
      .subscribe(() => {
        this.lastScrollTop = this.refs.userList.scrollTop;
        if (this.wait === false) {
          window.requestAnimationFrame(() => {
            if (this.lastScrollTop > 0) {
              this.refs.searchBar.classList.add('dark-bg');
            } else {
              this.refs.searchBar.classList.remove('dark-bg');
            }
            this.wait = false;
          });
          this.wait = true;
        }
      });
  }

  componentWillUnmount() {
    this.obsCancelSearch.dispose();
    this.obsReceiveUsers.dispose();
    this.obsHighlightSearchbar.dispose();
  }

  onSearchTextChange(e) {
    this.setState({
      searchText: e.target.value,
    });
    this.obsSearchTextChange.onNext(e.target.value);
  }

  userClick(path) {
    action.onNext({ name: ACTIONS.CLOSE_NAV_MENU });
    // Wait for animation done, we don't want to overheat the CPU
    setTimeout(() => {
      this.context.router.push(path);
    }, 300);
  }

  render() {
    return (
      <div
        id="nav-menu"
        className={classNames({ open: this.props.open })}
      >
        <div
          id="search-bar"
          ref="searchBar"
        >
          <SearchInput
            onFocus={() => action.onNext({ name: ACTIONS.FULL_NAV_MENU })}
            onChange={this.onSearchTextChange}
            value={this.state.searchText}
            placeholder="Search by username…"
            onSearch={() => actionFactory.getUsers(this.state.searchText)}
          />
          <div
            id="cancel-button"
            className={classNames({ show: this.props.full })}
            onClick={() => action.onNext({ name: ACTIONS.OPEN_NAV_MENU })}
          >Cancel</div>
        </div>
        <div
          id="user-list"
          ref="userList"
        >

          {this.state.searching ?
            <div id="loading">
              <div className="loading"></div>
            </div> :
            <ReactCSSTransitionGroup
              transitionName="list"
              transitionAppear
              transitionAppearTimeout={500}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
              {this.state.users.length ? this.state.users.map(user =>
                <a
                  key={user.id}
                  className="user-item"
                  onClick={() => this.userClick(`/user/${user.login}`)}
                >
                  <Image
                    className="user-avatar"
                    src={`https://avatars.githubusercontent.com/u/${user.id.split('-')[1]}`}
                  />
                  <div className="user-info">
                    <div className="fullname">{user.fullname || user.login}</div>
                    <div className="username">{user.login || user.fullname}</div>
                  </div>
                </a>
                ) : <div className="empty-data">
                  Hmm.. that user cannot be found on GitHub.
                </div>}
            </ReactCSSTransitionGroup>
          }

        </div>
      </div>
    );
  }
}

NavMenu.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
