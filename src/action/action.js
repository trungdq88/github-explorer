import Rx from 'rx';
import 'whatwg-fetch';

const TOKEN = '48d499e1bbc2e206d1e4f720f101af12a5918806';
const REPO_PER_PAGE = 10;

const action = new Rx.Subject();

const ACTION_TYPES = {
  TOGGLE_NAV_MENU: 'TOGGLE_NAV_MENU',
  OPEN_NAV_MENU: 'OPEN_NAV_MENU',
  FULL_NAV_MENU: 'FULL_NAV_MENU',
  CLOSE_NAV_MENU: 'CLOSE_NAV_MENU',
  USERS_RECEIVED: 'USERS_RECEIVED',
  USER_PROFILE_RECEIVED: 'USER_PROFILE_RECEIVED',
  USER_REPOS_RECEIVED: 'USER_REPOS_RECEIVED',
  USER_PROFILE_REPOS_RECEIVED: 'USER_PROFILE_REPOS_RECEIVED',
  USER_REPOS_NEXT_PAGE_RECEIVED: 'USER_REPOS_NEXT_PAGE_RECEIVED',
  USER_REPOS_COMPLETE: 'USER_REPOS_COMPLETE',
  REPO_DETAIL_RECEIVED: 'REPO_DETAIL_RECEIVED',
  REPO_README_RECEIVED: 'REPO_README_RECEIVED',
  REPO_CONTENTS_RECEIVED: 'REPO_CONTENTS_RECEIVED',
  REPO_CONTRIS_RECEIVED: 'REPO_CONTRIS_RECEIVED',
  REPO_LANGUAGES_RECEIVED: 'REPO_LANGUAGES_RECEIVED',
  DETAIL_TRANSITION_DATA: 'DETAIL_TRANSITION_DATA',
  TRIGGER_LOAD_ANIMATION: 'TRIGGER_LOAD_ANIMATION',
  TRIGGER_LOAD_ANIMATION_DONE: 'TRIGGER_LOAD_ANIMATION_DONE',
  BACK_BUTTON: 'BACK_BUTTON',
  REQUEST_FAILED: 'REQUEST_FAILED',
  SHOW_TOAST: 'SHOW_TOAST',
};

const api = (url) =>
  fetch(url, {
    headers: {
      Authorization: `token ${TOKEN}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    if (data.errors) {
      action.onNext({ name: ACTION_TYPES.REQUEST_FAILED, data });
      return Promise.reject(data);
    }
    return data;
  })
  .catch((...args) => {
    action.onNext({ name: ACTION_TYPES.REQUEST_FAILED, data: [...args] });
    return Promise.reject(...args);
  });

export const actionFactory = {
  getRandomUser: () =>
    api('https://api.github.com/search/users?q=type:user&page=1&per_page=1')
    .then(data => data.items[0]),
  getUsers: (keyword) =>
    api('https://api.github.com/legacy/user/search/' +
      `${keyword || Math.random().toString(36).split('')[2]}%20sort:followers`)
    .then(data => data.users.slice(0, 15))
    .then(users => {
      action.onNext({
        name: ACTION_TYPES.USERS_RECEIVED,
        data: users,
      });
    }),
  getUserProfile: (username) =>
    api(`https://api.github.com/users/${username}`)
    .then(profile => {
      action.onNext({
        name: ACTION_TYPES.USER_PROFILE_RECEIVED,
        data: profile,
      });
    }),
  getUserProfileRepos: (username) =>
    api('https://api.github.com/search/repositories' +
    `?q=user:${username}&sort=stars&page=1&per_page=${REPO_PER_PAGE}`)
    .then(data => {
      action.onNext({
        name: ACTION_TYPES.USER_PROFILE_REPOS_RECEIVED,
        data: data.items,
      });
    }),
  searchUserRepos: (user, keyword, page) =>
    api('https://api.github.com/search/repositories' +
    `?q=${keyword}%20user:${user}&sort=updated&page=${page}&per_page=${REPO_PER_PAGE}`)
    .then(data => {
      if (+page > 1) {
        action.onNext({
          name: ACTION_TYPES.USER_REPOS_NEXT_PAGE_RECEIVED,
          data: { page, repos: data.items },
        });
      } else {
        action.onNext({
          name: ACTION_TYPES.USER_REPOS_RECEIVED,
          data: data.items,
        });
      }
      if (data.items.length < REPO_PER_PAGE) {
        action.onNext({
          name: ACTION_TYPES.USER_REPOS_COMPLETE,
        });
      }
    }),
  getRepoDetail: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}`)
    .then(repo => {
      action.onNext({
        name: ACTION_TYPES.REPO_DETAIL_RECEIVED,
        data: repo,
      });
    }),
  getRepoReadme: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/readme`)
    .then(readme => {
      action.onNext({
        name: ACTION_TYPES.REPO_README_RECEIVED,
        data: readme,
      });
    }),
  getRepoContents: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/contents`)
    .then(contents => {
      action.onNext({
        name: ACTION_TYPES.REPO_CONTENTS_RECEIVED,
        data: contents,
      });
    }),
  getRepoContribs: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/contributors`)
    .then(contris => {
      action.onNext({
        name: ACTION_TYPES.REPO_CONTRIS_RECEIVED,
        data: contris,
      });
    }),
  getRepoLanguages: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/languages`)
    .then(languages => {
      action.onNext({
        name: ACTION_TYPES.REPO_LANGUAGES_RECEIVED,
        data: languages,
      });
    }),
};

if (window.ENV === 'development') {
  action.subscribe(console.log.bind(console, '[ACTION]'));
  window.action = action;
}

export const ACTIONS = ACTION_TYPES;
export default action;
