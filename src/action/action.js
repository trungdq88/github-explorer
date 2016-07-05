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
  USER_REPOS_NEXT_PAGE_RECEIVED: 'USER_REPOS_NEXT_PAGE_RECEIVED',
  USER_REPOS_COMPLETE: 'USER_REPOS_COMPLETE',
  REPO_DETAIL_RECEIVED: 'REPO_DETAIL_RECEIVED',
  REPO_README_RECEIVED: 'REPO_README_RECEIVED',
  REPO_CONTENTS_RECEIVED: 'REPO_CONTENTS_RECEIVED',
  REPO_CONTRIS_RECEIVED: 'REPO_CONTRIS_RECEIVED',
  REPO_LANGUAGES_RECEIVED: 'REPO_LANGUAGES_RECEIVED',
  DETAIL_TRANSITION_DATA: 'DETAIL_TRANSITION_DATA',
};

action.subscribe(console.log.bind(console, '[ACTION]'));

export default action;

const api = (url) => fetch(url, {
  headers: {
    Authorization: `token ${TOKEN}`,
  },
});

export const actionFactory = {
  getUsers: (keyword) =>
    api(`https://api.github.com/legacy/user/search/${keyword || 't'}%20sort:followers`)
    .then(response => response.json())
    .then(data => data.users.slice(0, 15))
    .then(users => {
      action.onNext({
        name: ACTION_TYPES.USERS_RECEIVED,
        data: users,
      });
    }),
  getUserProfile: (username) =>
    api(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(profile => {
      action.onNext({
        name: ACTION_TYPES.USER_PROFILE_RECEIVED,
        data: profile,
      });
    }),
  getUserRepos: (username) =>
    api(`https://api.github.com/users/${username}/repos?sort=pushed&page=1&per_page=${REPO_PER_PAGE}`)
    .then(response => response.json())
    .then(repos => {
      action.onNext({
        name: ACTION_TYPES.USER_REPOS_RECEIVED,
        data: repos,
      });
      if (repos.length < REPO_PER_PAGE) {
        action.onNext({
          name: ACTION_TYPES.USER_REPOS_COMPLETE,
        });
      }
    }),
  getUserReposNextPage: (username, page) =>
    api(`https://api.github.com/users/${username}/repos?sort=pushed&page=${page + 1}&per_page=${REPO_PER_PAGE}`)
    .then(response => response.json())
    .then(repos => {
      action.onNext({
        name: ACTION_TYPES.USER_REPOS_NEXT_PAGE_RECEIVED,
        data: { page: page + 1, repos },
      });
      if (repos.length < REPO_PER_PAGE) {
        action.onNext({
          name: ACTION_TYPES.USER_REPOS_COMPLETE,
        });
      }
    }),
  getRepoDetail: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}`)
    .then(response => response.json())
    .then(repo => {
      action.onNext({
        name: ACTION_TYPES.REPO_DETAIL_RECEIVED,
        data: repo,
      });
    }),
  getRepoReadme: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/readme`)
    .then(response => response.json())
    .then(readme => {
      action.onNext({
        name: ACTION_TYPES.REPO_README_RECEIVED,
        data: readme,
      });
    }),
  getRepoContents: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/contents`)
    .then(response => response.json())
    .then(contents => {
      action.onNext({
        name: ACTION_TYPES.REPO_CONTENTS_RECEIVED,
        data: contents,
      });
    }),
  getRepoContribs: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/contributors`)
    .then(response => response.json())
    .then(contris => {
      action.onNext({
        name: ACTION_TYPES.REPO_CONTRIS_RECEIVED,
        data: contris,
      });
    }),
  getRepoLanguages: (username, repoName) =>
    api(`https://api.github.com/repos/${username}/${repoName}/languages`)
    .then(response => response.json())
    .then(languages => {
      action.onNext({
        name: ACTION_TYPES.REPO_LANGUAGES_RECEIVED,
        data: languages,
      });
    }),
};

export const ACTIONS = ACTION_TYPES;
