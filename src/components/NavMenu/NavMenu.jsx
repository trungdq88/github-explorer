import React from 'react';
import Rx from 'rx';
import classNames from 'classnames';
import SearchInput from '../SearchInput/SearchInput.jsx';
import { Link } from 'react-router';
import './style.less';

import action, { ACTIONS, actionFactory } from '../../action/action.js';

export default class NavMenu extends React.Component {

  constructor() {
    super();
    this.state = {
      searchText: '',
      users: [],
    };

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
      this.setState({ users });
    });
    this.obsTriggerTextChange = this.obsSearchTextChange
    .debounce(1000)
    .subscribe(text => actionFactory.getUsers(text));

    // Send get users request
    actionFactory.getUsers();
  }

  componentWillUnmount() {
    this.obsCancelSearch.dispose();
    this.obsReceiveUsers.dispose();
  }

  onSearchTextChange(e) {
    this.setState({
      searchText: e.target.value,
    });
    this.obsSearchTextChange.onNext(e.target.value);
  }

  render() {
    return (
      <div id="nav-menu">
        <div
          id="menu-overlay"
          style={{ display: this.props.open && !this.props.full ? 'block' : 'none' }}
          onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}
        ></div>
        <div id="search-bar">
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

          {this.state.users.map(user =>
            <Link
              key={user.id}
              className="user-item"
              to={`/user/${user.login}`}
              onClick={() => action.onNext({ name: ACTIONS.CLOSE_NAV_MENU })}
            >
              <div
                className="user-avatar"
                style={{ backgroundImage: `url('https://avatars.githubusercontent.com/u/${user.id.split('-')[1]}')` }}
              ></div>
              <div className="user-info">
                <div className="fullname">{user.fullname}</div>
                <div className="username">{user.login}</div>
              </div>
            </Link>
          )}

        </div>
      </div>
    );
  }
}
