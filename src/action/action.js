import Rx from 'rx';
import 'whatwg-fetch';

const action = new Rx.Subject();

const ACTION_TYPES = {
  TOGGLE_NAV_MENU: 'TOGGLE_NAV_MENU',
  OPEN_NAV_MENU: 'OPEN_NAV_MENU',
  FULL_NAV_MENU: 'FULL_NAV_MENU',
  CLOSE_NAV_MENU: 'CLOSE_NAV_MENU',
  USERS_RECEIVED: 'USERS_RECEIVED',
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
    })
  ,
};

export const ACTIONS = ACTION_TYPES;
