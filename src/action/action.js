import Rx from 'rx';

const action = new Rx.Subject();

action.subscribe(console.log.bind(console, '[ACTION]'));

export default action;

export const ACTIONS = {
  TOGGLE_NAV_MENU: 'TOGGLE_NAV_MENU',
  OPEN_NAV_MENU: 'OPEN_NAV_MENU',
  FULL_NAV_MENU: 'FULL_NAV_MENU',
  CLOSE_NAV_MENU: 'CLOSE_NAV_MENU',
};
