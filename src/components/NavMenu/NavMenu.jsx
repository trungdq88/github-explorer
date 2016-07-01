import React from 'react';
import Rx from 'rx';
import classNames from 'classnames';
import SearchInput from '../SearchInput/SearchInput.jsx';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Image from '../Image/Image.jsx';
import './style.less';
import './svg/loading.svg';

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

    // Move search bar
    this.obsMoveSearchBar = Rx.Observable
    .fromEvent(this.refs.navMenu, 'scroll')
    .subscribe(() => {
      this.lastScrollTop = this.refs.navMenu.scrollTop;
      if (this.wait === false) {
        window.requestAnimationFrame(() => {
          this.refs.searchBar.style.transform =
            `translate3d(0, ${this.lastScrollTop}px, 0)`;
          this.refs.searchBar.style.backgroundColor =
            this.lastScrollTop === 0 ? 'rgba(0, 0, 0, 0)' : '#2E3F53';
          this.wait = false;
        });
        this.wait = true;
      }
    });
  }

  componentWillUnmount() {
    this.obsCancelSearch.dispose();
    this.obsReceiveUsers.dispose();
    this.obsMoveSearchBar.dispose();
  }

  onSearchTextChange(e) {
    this.setState({
      searchText: e.target.value,
    });
    this.obsSearchTextChange.onNext(e.target.value);
  }

  render() {
    return (
      <div
        id="nav-menu"
        ref="navMenu"
        className={classNames({ open: this.props.open })}
      >
        <div
          id="menu-overlay"
          style={{ display: this.props.open && !this.props.full ? 'block' : 'none' }}
          onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}
        ></div>
        <div
          id="search-bar"
          ref="searchBar"
        >
          <SearchInput
            onFocus={() => action.onNext({ name: ACTIONS.FULL_NAV_MENU })}
            onChange={this.onSearchTextChange}
            value={this.state.searchText}
            placeholder="Search by username…"
          />
          <div
            id="cancel-button"
            className={classNames({ show: this.props.full })}
            onClick={() => action.onNext({ name: ACTIONS.OPEN_NAV_MENU })}
          >Cancel</div>
        </div>
        <div id="user-list">

          {this.state.searching ?
            <div id="loading">
              <img role="presentation" src="/assets/loading.svg" />
            </div> :
            <ReactCSSTransitionGroup
              transitionName="list"
              transitionAppear
              transitionAppearTimeout={500}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
            >
              {this.state.users.map(user =>
                <Link
                  key={user.id}
                  className="user-item"
                  to={`/user/${user.login}`}
                  onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}
                >
                  <Image
                    className="user-avatar"
                    src={`https://avatars.githubusercontent.com/u/${user.id.split('-')[1]}`}
                  />
                  <div className="user-info">
                    <div className="fullname">{user.fullname || user.login}</div>
                    <div className="username">{user.login || user.fullname}</div>
                  </div>
                </Link>
              )}
            </ReactCSSTransitionGroup>
          }

        </div>
      </div>
    );
  }
}
