import Rx from 'rx';
import 'whatwg-fetch';

const action = new Rx.Subject();

const ACTION_TYPES = {
  TOGGLE_NAV_MENU: 'TOGGLE_NAV_MENU',
  OPEN_NAV_MENU: 'OPEN_NAV_MENU',
  FULL_NAV_MENU: 'FULL_NAV_MENU',
  CLOSE_NAV_MENU: 'CLOSE_NAV_MENU',
  USERS_RECEIVED: 'USERS_RECEIVED',
  USER_PROFILE_RECEIVED: 'USER_PROFILE_RECEIVED',
  USER_REPOS_RECEIVED: 'USER_REPOS_RECEIVED',
  USER_REPOS_NEXT_PAGE_RECEIVED: 'USER_REPOS_NEXT_PAGE_RECEIVED',
};

action.subscribe(console.log.bind(console, '[ACTION]'));

export default action;

export const actionFactory = {
  getUsers: (keyword) =>
    fetch(`https://api.github.com/legacy/user/search/${keyword || 't'}%20sort:followers`)
    .then(response => response.json())
    .then(data => data.users)
    .then(users => {
      action.onNext({
        name: ACTION_TYPES.USERS_RECEIVED,
        data: users,
      });
    }),
  getUserProfile: (username) =>
    fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(profile => {
      action.onNext({
        name: ACTION_TYPES.USER_PROFILE_RECEIVED,
        data: profile,
      });
    }),
  getUserRepos: (username) =>
    fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=10`)
    .then(response => response.json())
    .then(repos => {
      action.onNext({
        name: ACTION_TYPES.USER_REPOS_RECEIVED,
        data: repos,
      });
    }),
  getUserReposNextPage: (username, page) =>
    fetch(`https://api.github.com/users/${username}/repos?page=${page + 1}&per_page=10`)
    .then(response => response.json())
    .then(repos => {
      action.onNext({
        name: ACTION_TYPES.USER_REPOS_NEXT_PAGE_RECEIVED,
        data: { page: page + 1, repos },
      });
    }),
};

export const ACTIONS = ACTION_TYPES;
